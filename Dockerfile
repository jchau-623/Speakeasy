#Production dockerfile

FROM python:3.12

WORKDIR /backend

COPY backend/requirements.txt .

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY backend /backend

WORKDIR /
COPY frontend/dist /frontend/dist
WORKDIR /backend/app

CMD ["python", "main.py"]
