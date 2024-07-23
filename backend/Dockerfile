FROM python:3.12

WORKDIR /app

COPY requirements.txt /app

RUN pip install --upgrade pip && pip install -r /app/requirements.txt

EXPOSE 8000

COPY ./app /app

CMD ["python", "main.py"]
