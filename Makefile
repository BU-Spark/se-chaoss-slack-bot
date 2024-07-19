IMAGE_NAME := se-chaoss-slack-bot
CONTAINER_FNAME := Containerfile

help:
	@echo "make podman-build - Build and locally tag a new image using podman"
	@echo "make podman-build-force - Use a no-cache build using podman"
	@echo "make podman-run - Launch the bot in the container using podman"
	@echo "make docker-build - Build and locally tag a new image using docker"
	@echo "make docker-build-force - Use a no-cache build using docker"
	@echo "make docker-run - Launch the bot in the container using docker"

podman-build:
	@podman build -t $(IMAGE_NAME) --file=$(CONTAINER_FNAME) .

podman-build-force:
	@podman pull fedora-minimal:latest
	@podman build  -t $(IMAGE_NAME) --file=$(CONTAINER_FNAME) --no-cache .

podman-run:
	@podman run --rm -it \
		-p 3000:3000 \
		-v ${PWD}:/app:z \
		$(IMAGE_NAME)

docker-build:
	@docker build -t $(IMAGE_NAME) --file=$(CONTAINER_FNAME) .

docker-build-force:
	@docker pull fedora-minimal:latest
	@docker build  -t $(IMAGE_NAME) --file=$(CONTAINER_FNAME) --no-cache .

docker-run:
	@docker run --rm -it \
		-p 3000:3000 \
		-v ${PWD}:/app:z \
		$(IMAGE_NAME)