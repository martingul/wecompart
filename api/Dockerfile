FROM python:3.9
RUN mkdir -p /api
COPY requirements.txt /api/requirements.txt
COPY src/ /api/src
RUN python -m pip install -r /api/requirements.txt

ENTRYPOINT ["python", "/api/src/main.py"]