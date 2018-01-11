
JOBDATE		?= $(shell date -u +%Y-%m-%dT%H%M%SZ)
GIT_REVISION	= $(shell git rev-parse --short HEAD)
VERSION		?= $(shell git describe --tags --abbrev=0)

LDFLAGS		+= -X Version=$(VERSION)
LDFLAGS		+= -X Revision=$(GIT_REVISION)
LDFLAGS		+= -X BuildDate=$(JOBDATE)

.PHONY: release


build:
	@echo "++ Building kulbe"
	@echo "$(GOPATH)"
	CGO_ENABLED=0 GOOS=linux npm install update rebuild
image:
	docker build -t ffdcdevuksouth.azurecr.io/ffdc/dimidium:alpha-5 -f Dockerfile .

alpha: image
	@echo "++ Pushing keel alpha"	
	docker push ffdcdevuksouth.azurecr.io/ffdc/dimidium:alpha-5
