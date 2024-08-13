FROM python:3.12

WORKDIR /app

COPY requirements.txt /app

RUN pip install --upgrade pip && pip install -r /app/requirements.txt

COPY ./app /app

COPY ../frontend/dist ../frontend/dist

# EXPOSE 8080

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]

CMD ["python", "main.py"]
