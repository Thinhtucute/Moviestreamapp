import asyncio
import aiohttp
import aiomysql


# ====== CONFIG ======
TMDB_API_KEY = "39167e68078850d5fdb7e041adbae16c"

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "1",
    "db": "movie_streaming_app"
}

TMDB_BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

BATCH_SIZE = 200
CONCURRENCY = 35     # safe: ~20–30 req/sec
MAX_RETRIES = 3


# ====== HELPERS ======
def normalize_media_type(media_type):
    if media_type.lower() in ["movie", "film"]:
        return "movie"
    elif media_type.lower() in ["tv", "series", "show"]:
        return "tv"
    return None


async def fetch_tmdb(session, semaphore, tmdb_id, media_type):
    url = f"{TMDB_BASE_URL}/{media_type}/{tmdb_id}"
    params = {"api_key": TMDB_API_KEY}

    async with semaphore:
        for attempt in range(MAX_RETRIES):
            try:
                async with session.get(url, params=params, timeout=10) as resp:
                    if resp.status == 404:
                        return None, None

                    if resp.status != 200:
                        await asyncio.sleep(1 * (attempt + 1))
                        continue

                    data = await resp.json()

                    poster = data.get("poster_path")
                    backdrop = data.get("backdrop_path")

                    poster_url = IMAGE_BASE_URL + poster if poster else None
                    backdrop_url = IMAGE_BASE_URL + backdrop if backdrop else None

                    return poster_url, backdrop_url

            except asyncio.TimeoutError:
                await asyncio.sleep(1 * (attempt + 1))

    return None, None


# ====== MAIN ======
async def process_batch(pool, session, semaphore, rows):
    tasks = []

    for row in rows:
        media_type = normalize_media_type(row["MediaType"])
        if not media_type:
            tasks.append(None)
            continue

        task = fetch_tmdb(session, semaphore, row["MediaId"], media_type)
        tasks.append(task)

    results = await asyncio.gather(*tasks)

    updates = []

    for row, result in zip(rows, results):
        if result is None:
            continue

        poster_url, backdrop_url = result

        fields = []
        values = []

        if row["PosterURL"] is None and poster_url:
            fields.append("PosterURL=%s")
            values.append(poster_url)

        if row["BackdropURL"] is None and backdrop_url:
            fields.append("BackdropURL=%s")
            values.append(backdrop_url)

        if fields:
            values.extend([row["MediaId"], row["MediaType"]])
            updates.append((fields, values))

    # Bulk execute
    async with pool.acquire() as conn:
        async with conn.cursor() as cur:
            for fields, values in updates:
                query = f"""
                    UPDATE Media
                    SET {', '.join(fields)}
                    WHERE MediaId=%s AND MediaType=%s
                """
                await cur.execute(query, values)

        await conn.commit()

    return len(updates)


async def main():
    pool = await aiomysql.create_pool(**DB_CONFIG, autocommit=False)

    semaphore = asyncio.Semaphore(CONCURRENCY)

    async with aiohttp.ClientSession() as session:
        offset = 0
        total_updated = 0

        while True:
            async with pool.acquire() as conn:
                async with conn.cursor(aiomysql.DictCursor) as cur:
                    await cur.execute(f"""
                        SELECT MediaId, MediaType, PosterURL, BackdropURL
                        FROM Media
                        WHERE PosterURL IS NULL OR BackdropURL IS NULL
                        LIMIT {BATCH_SIZE} OFFSET {offset}
                    """)
                    rows = await cur.fetchall()

            if not rows:
                break

            print(f"Processing batch offset={offset}, size={len(rows)}")

            updated_count = await process_batch(pool, session, semaphore, rows)
            total_updated += updated_count

            print(f"Updated {updated_count} rows (total={total_updated})")

            offset += BATCH_SIZE

    pool.close()
    await pool.wait_closed()

    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())