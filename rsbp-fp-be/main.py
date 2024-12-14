from fastapi import FastAPI
from routers import popular, recommend, near
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="FP-RSBP Tourism API",
    description="API untuk tempat wisata, rekomendasi, dan popularitas.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti dengan domain frontend Anda untuk keamanan, contoh: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Mengizinkan semua metode (GET, POST, OPTIONS, dll.)
    allow_headers=["*"],  # Mengizinkan semua header
)

# Daftar Routers
app.include_router(popular.router, prefix="/popular", tags=["Wisata Populer"])
app.include_router(recommend.router, prefix="/recommend", tags=["Rekomendasi Wisata"])
app.include_router(near.router, prefix="/near", tags=["Wisata Terdekat"])

# Route Default
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to FP-RSBP Tourism API"}
