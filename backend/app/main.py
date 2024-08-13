from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.user_routes import user_router

from api.idiom_routes import idiom_router
from api.history_routes import history_router
from api.slang_routes import slang_router
from api.search_route import search_router
from api.idiom_routes import idiom_router
from api.history_routes import history_router
from databases.connection import Settings
import uvicorn

app = FastAPI()

origins = ["localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router, prefix="/api/user", tags=["User"])
# app.include_router(user_router, prefix="/user")
app.include_router(slang_router, prefix="/api/slangs", tags=["Slang"])
app.include_router(search_router, prefix="/api/search", tags=["User"])
app.include_router(idiom_router, prefix="/api/idioms", tags=["Idiom"])
app.include_router(history_router, prefix="/api/history", tags=["History"])


app.mount("/", StaticFiles(directory="../../frontend/dist", html=True), name="static")


@app.on_event("startup")
async def on_startup():
    settings = Settings()
    await settings.initialize_database()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
