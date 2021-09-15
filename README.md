# Kinesis Event Streams Consumer

This is a sample implementation of a NodeJS consumer for Twilio's Event Streams integration with AWS Kinesis. The idea behind this project is to demonstrate how easily can be to consume streams generated from Twilio Event Streams using AWS Kinesis and NodeJS as the runtime.

## Architecture

In order to consume Kinesis Streams using JavaScript/NodeJS, Amazon developed a wrapper application called KCL that serves as a runtime environment the stablishes the communication between your app and the Kinesis Stream. This process is not very well documented and has some specific things that needs to be configured both on the KCL side, and also on the consumer script, so the idea of this project is to serve as a quickstart that you can clone and start modifying it for your own needs, and below are described the components of this quickstart in order to give you some context of what is happening under the hood.

### KCL (MultiLangDaemon)

The KCL (Kinesis Client Library), also known as MultiLangDaemon, is a wrapper application, developed by Amazon using their SDK for Java language, that creates a runtime environment, to run a script that is aiming to connect and consume Kinesis Streams. This script can be developed in any programming language, and communicate to the wrapper using standard file descriptors (STDIN, STDOUT, STDERR), allowing the communication with the Kinesis Stream.

#### bin/kcl-bootstrap

This script is helper script responsible to download the KCL libraries and start the execution of the deamon, as well of the consumer script.

#### consumer.properties

This is the main configuration file for KCL, here you can configure the name of your stream as well other configurations regarding to the number of shards, timeout options and etc. All the available configurations are described in the file itself.

#### src/consumer.js

This is the bootstrap file, here lives the code that listen to the stream, and it is a basic implementation of a [recordProcessor interface](https://docs.aws.amazon.com/streams/latest/dev/kinesis-record-processor-implementation-app-nodejs.html). 

#### src/logger.js

This is a basic logger factory implementation, that returns an instance of a Log4JS logger.

## Requirements

- NodeJS 12 or greater
- NPM 6.14+
- Java 1.8 or greater
- Twilio CLI 2.27 or greater
- AWS CLI 2.2 or greater

## Installing

### Clone the repository

The first thing you need to do, is cloning the repository:

```
$ git clone git@github.com:devsdmf/twilio-event-streams-nodejs-consumer.git
```

### Creating a Kinesis Stream and Configuring Event Streams

In order to configure a Kinesis Stream and subscribe to events on your Twilio account, refer to this [documentation](https://www.twilio.com/docs/events/eventstreams-quickstart).

### Setting up AWS Credentials

Before running the application, you need to setup the AWS security, which will be used by the KCL Daemon to interact with the Kinesis stream and DynamoDB(more details [here](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.htm://docs.aws.amazon.com/general/latest/gr/aws-security-credentials.html)). By default, the KCL uses the [DefaultAWSCredentialsProviderChain](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html), so make your credentials available to one of the credential providers in that provider chain. The easiest way to do this is through the following CLI command:

```
$ aws configure
```

More information about the configuration process can be found [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

### Setting up logs directory

Since the KCL uses the STDIN, STDOUT and STDERR file descriptors to interact with the Kinesis Stream, you can print log information directly to the STDOUT of the script, this way, you need to rely on another file descriptor, which is by default, a log file. You can specify a directory where you want to write the log file, which by default, is the root folder of the project. You can change that using the following environment variable:

```
$ export NODE_LOG_DIR=/path/to/logs
```

You might want to use a different log strategy, and that's why this project uses the [Log4JS](https://github.com/log4js-node/log4js-node) library, that has custom appenders that allows you to send the logs to different places, like Loggly, Splunk or even e-Mail. Please, refer to the library docs in order to customize the `logger.js` file.

## Running the application

In order to start the daemon application, you need to run the following command, remember to update the path to the java executable before executing:

```
$ cd /path/to/the/project
$ ./bin/kcl-bootstrap --java /path/to/java -e -p ./consumer.properties
```

In another terminal window, you can watch the logs using the command below:

```
$ tail -f /path/to/application.log
```

Now, wait for the workers to start, and go send some messages (or push some data) in your stream.

## More Resources

- [Twilio EventStreams Quickstart](https://www.twilio.com/docs/events/eventstreams-quickstart)
- [Twilio CLI Quickstart](https://www.twilio.com/docs/twilio-cli/quickstart)
- [Kinesis Data Streams](https://docs.aws.amazon.com/streams/latest/dev/introduction.html)
- [Developing a Kinesis Client Library Consumer in NodeJS](https://docs.aws.amazon.com/streams/latest/dev/kinesis-record-processor-implementation-app-nodejs.html)
- [Amazon Kinesis Client Library for Java](https://github.com/awslabs/amazon-kinesis-client)
- [Amazon Kinesis Client Library for NodeJS](https://github.com/awslabs/amazon-kinesis-client-nodejs)
- [Amazon AWS Command Line Interface CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)

## Disclaimer

This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.

## License

This project is licensed under the [MIT license](LICENSE), that means that it is free to use, copy and modified for your own intents.
