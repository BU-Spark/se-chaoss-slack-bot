# Use Fedora minimal as a parent image
FROM fedora-minimal:latest

# Install Node.js, npm, and Git
RUN microdnf install -y nodejs npm git procps which && \
    microdnf clean all

# for vscode
RUN microdnf install -y tar && \
    microdnf clean all

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . /app

# Create a directory for global node_modules
RUN mkdir /global_node_modules && \
    cp package*.json /global_node_modules/

RUN cd /global_node_modules && \
    npm install && \
    cd /app && \
    rm -rf /app/node_modules && \
    ln -s /global_node_modules/node_modules /app/node_modules

# Make port 3000 available to the world outside this container
EXPOSE 3000

VOLUME /app

# Run app.js when the container launches
CMD ["./launch-app.sh"]