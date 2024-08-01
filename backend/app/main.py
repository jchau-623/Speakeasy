import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.user_routes import user_router
from api.idiom_routes import idiom_router
from api.history_routes import history_router
from databases.connection import Settings

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/user")
app.include_router(idiom_router, prefix="/idiom")
app.include_router(history_router, prefix="/history")

@app.on_event("startup")
async def on_startup():
    settings = Settings()
    await settings.initialize_database()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)