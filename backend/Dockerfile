FROM python:3.12

# Install pipenv and build dependencies
RUN apt-get update && apt-get install -y \
    python3-distutils \
    python3-setuptools \
    build-essential \
    && pip install pipenv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Pipfile /app
COPY Pipfile.lock /app

RUN pipenv install --deploy --ignore-pipfile

COPY ./app /app

EXPOSE 8080

CMD ["pipenv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"]
