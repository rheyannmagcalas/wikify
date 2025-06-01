VENV_NAME = .venv
PYTHON = $(VENV_NAME)/bin/python
PIP = $(VENV_NAME)/bin/pip
UVICORN = $(VENV_NAME)/bin/uvicorn

all: install run

$(VENV_NAME)/bin/activate:
	python3 -m venv $(VENV_NAME)

install: $(VENV_NAME)/bin/activate
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

run:
	$(UVICORN) app.main:app --reload

clean:
	rm -rf $(VENV_NAME)
