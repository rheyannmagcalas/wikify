VENV_NAME = .venv
PYTHON = $(VENV_NAME)/bin/python
PIP = $(VENV_NAME)/bin/pip
UVICORN = $(VENV_NAME)/bin/uvicorn
PORT = 8000

all: install run

$(VENV_NAME)/bin/activate:
	python3 -m venv $(VENV_NAME)

install: $(VENV_NAME)/bin/activate
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

run:
	$(UVICORN) app.main:app --reload --host 0.0.0.0 --port $(PORT)

clean:
	rm -rf $(VENV_NAME)
