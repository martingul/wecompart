FROM python:3.9 AS build-image

RUN mkdir -p /api
WORKDIR /api

RUN python -m venv .venv
ENV PATH="/api/.venv/bin:$PATH"
COPY requirements.txt .
RUN python -m pip install --upgrade pip
RUN python -m pip install pip-tools
RUN pip-sync

FROM python:3.9 as run-image

EXPOSE 5000/tcp
WORKDIR /api

COPY --from=build-image /api/.venv/ .venv/
COPY src/ src/
ENV PATH="/api/.venv/bin:$PATH"
ENTRYPOINT ["python", "src/main.py"]