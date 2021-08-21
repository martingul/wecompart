FROM python:3.9

RUN mkdir -p /api
# TODO run in virtual environment for multi-stage builds
COPY ./requirements.txt /api/requirements.txt
RUN python -m pip install --upgrade pip
RUN python -m pip install -r /api/requirements.txt

EXPOSE 5000/tcp

COPY ./src/ /api/src
ENTRYPOINT ["python", "/api/src/main.py"]