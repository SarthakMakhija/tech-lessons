---
layout: post
title: AWS Lambda - A Virtual Podcast
date: 2020-04-19
type: post
parent_id: '0'
published: true
password: ''
status: published
categories:
- Serverless
tags:
- AWS Lambda
- Serverless
author: sarthakmakhija
permalink: "/aws-lambda-a-virtual-podcast/"
feature-img: "assets/img/pexels/aws-lambda-virtual-podcast.jpg"
thumbnail: "assets/img/pexels/aws-lambda-virtual-podcast.jpg"
caption: "Photo by Gezer Amorim on Pexels"
excerpt: AWS Lambda is a serverless compute service and after having worked with it for sometime, I felt it is a good time for me to share my learning and experiences. I have been thinking of writing an article in a "Virtual Podcast format" and felt this could be the one.        
---

<blockquote class="wp-block-quote">
    <p>AWS Lambda is a serverless compute service and after having worked with it for sometime, I felt it is a good time for me to share my learning and experiences. I have been thinking of writing an article in a "Virtual Podcast format" and felt this could be the one.</p>
</blockquote>

Welcome all to this article named <i>AWS Lambda - A Virtual Podcast</i> and let me introduce our guests Mr. Hernandez and Ms. Jessica who would walk us through their experiences of using AWS Lambda. 

Welcome, Hernandez and Jessica and thank you for participating in this <i>Virtual Podcast</i>. Let's get started.

### What is AWS Lambda 

<span class="me">Me></span> My first question to you Jessica is "What is AWS Lambda?"

<span class="jessica">Jessica></span> AWS Lambda is a <b>serverless compute service</b> which allows you to execute a function in response to various events without provisioning or managing servers. What this means is your function will execute ONLY when there is a request for it.

<span class="me">Me></span> So what I gather is, a function is an entry point which gets invoked by AWS Lambda service. Is that right? 

<span class="jessica">Jessica></span> That's nearly right. When you create a lambda function, you need to specify a handler which is nothing but the <b>filename.exported function name</b> that acts as an entry point for your application. 

Let's say, you have a file named "handler.js" and it exports a function named "processOrders", your handler becomes <b>handler.processOrders</b> which will be invoked by AWS Lambda in response to events.

<span class="me">Me></span> Thank you Jessica. 

<blockquote class="wp-block-quote">
    <p>AWS Lambda is a serverless compute service which allows you to execute a function in response to various events without provisioning or managing servers. When you create a lambda function, you need to specify a handler which acts as an entry point for your lambda function.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### How does a lambda function execute?
<span class="me">Me></span> Jessica, you mentioned that a lambda function runs in response to an event, but where does it run?

<span class="jessica">Jessica></span> When you create a lambda function, you need to specify a <b>runtime</b> say, <i>node12.x</i>, <i>python3.7</i> or anything else. When there is a request for your lambda function, AWS will provision a container with the selected runtime and then run your function.

<span class="me">Me></span> So it is actually a container within which a lambda function is run. Does that also mean your lambda function gets some storage on file system? 

<span class="jessica">Jessica></span> Yes, your lambda function gets around <b>500MB</b> of storage in <b>/tmp</b> directory but that is ephemeral. It goes away as the container goes away.

<blockquote class="wp-block-quote">
    <p>AWS will provision a container to run your function when there is a request for your lambda function. This container will be discarded after some inactive time.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### What is AWS Lambda Cold Start

<span class="me">Me></span> Hernandez, since a lambda function is not always running, does it increase the response time of a request?

<span class="hernandez">Hernandez></span> Like Jessica mentioned, a lambda function will run inside a container which will stay active till the time your function is running. This container will be discarded by AWS after some inactive time thus making your function inactive and this is called as cold state. 

Whenever there is a request for a cold function, AWS needs to provision a container for running your function and this is called as <b>Cold Start.</b> So, to answer your question, yes, cold start can add to the response time of a request.

<span class="me">Me></span> Is there a way to avoid cold start?

<span class="hernandez">Hernandez></span> Yes. AWS has now introduced <b>Provisioned Concurrency</b> which is designed to keep your functions <b>initialized</b> and ready to respond in double-digit milliseconds at the scale you need. [Provisioned concurrency](https://aws.amazon.com/blogs/aws/new-provisioned-concurrency-for-lambda-functions/) adds pricing dimension though. 

You can turn it ON/OFF from AWS console or CloudFormation template.

If you are using <b>serverless framework</b> you should checkout this [blog](https://serverless.com/blog/keep-your-lambdas-warm/) for keeping your functions warm.

<span class="me">Me></span> Thank you Hernandez.

<blockquote class="wp-block-quote">
    <p>AWS needs to provision a container for running your cold function and this is called as Cold Start. You should check Provisioned Concurrency (or even Serverless plugin WarmUP) for keeping your functions initialized.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### AWS Lambda Configuration

<span class="me">Me></span> Jessica, what are the different configuration options one can specify while creating a lambda function?

<span class="jessica">Jessica></span> You can specify a lot of options including -
+ IAM role 
+ Memory, which ranges from <i>128MB to 3GB</i> 
+ Timeout, which ranges from <i>1sec to 15mins</i>
+ Environment variables, which can be upto <i>4KB</i> in size
+ VPC configuration for executing your function inside a VPC
+ Concurrency

<span class="me">Me></span> Wow, these are too many. Jessica you mentioned memory, but no mention of CPU?

<span class="jessica">Jessica></span> Yes, you can not control the amount of CPU that gets allocated to your lambda function, it is actually proportional to the amount of memory allocated. 

<span class="me">Me></span> I see. Jessica, what do you mean by <b>Concurrency</b> of a lambda function?

<span class="jessica">Jessica></span> I like the example given in [Managing AWS Lambda Function Concurrency](https://aws.amazon.com/blogs/compute/managing-aws-lambda-function-concurrency/). Imagine each slice of a pizza is an execution unit of a lambda function and the entire pizza represents the <i>shared concurrency pool</i> for all lambda functions in an AWS account. 

Let's say, we set concurrency limit of 100 for a lambda function, all we are saying is the lambda function will have a total of 100 pizza slices which means you can have 100 concurrent executions of lambda function. Concurrency limit set for a lambda function is reduced from concurrency pool, which is 1000 for all lambda functions per AWS account - the entire pizza.            
    
<span class="me">Me></span> Jessica, I also see an option of <b>Unreserved Concurrency</b> in lambda configuration. What is that?

<span class="jessica">Jessica></span> AWS also reserves 100 units of concurrency for all functions that don’t have a specified concurrency limit set. This helps to make sure that future functions have capacity to be consumed.

<span class="me">Me></span> Thank you Jessica. I am starting to wonder what happens when a lambda function's concurrency limit is reached and there are more requests?

<span class="jessica">Jessica></span> Lambda function gets <b>throttled</b>.

<span class="me">Me></span> Does that mean a client of your lambda function say API Gateway will get an error?

<span class="jessica">Jessica></span> It actually depends on the type of request. If it a <b>synchronous</b> request, it will end with a <b>timeout error</b>. 

Whereas in case of <b>asynchronous</b> request, say from SQS, AWS Lambda will <b>retry</b> your lambda function before sending the request event to a Dead Letter Queue, assuming one is configured. 

<blockquote class="wp-block-quote">
    <p>Various configuration options can be specified while creating a lambda function including IAM role, memory, timeout, VPC concurrency etc.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>


### AWS Lambda Debugging

<span class="me">Me></span> Hernandez, what AWS services can help us with debugging an issue with a lambda function?

<span class="hernandez">Hernandez></span> AWS Lambda function logs are sent to <b>CloudWatch</b> and lambda function needs an IAM role in order to that. Other than CloudWatch, you can also use <b>AWS X-Ray</b> for tracing and debugging performance issues.

<span class="me">Me></span> Nice. How to set up AWS X-Ray with lambda function? Do you need to set up an X-Ray agent or something like that?

<span class="hernandez">Hernandez></span> No, with lambda function, you need to do a very few things in order to set up tracing -

+ Set up an <b>IAM role</b> in order to send traces to AWS X-Ray
+ Enable <b>ActiveTracing</b> either in AWS console or CloudFormation
+ Use <b>AWS X-Ray SDK</b> in your lambda function code

Rest everything is taken care by AWS Lambda.

<span class="me">Me></span> Ok. Once this is done, AWS will be able to build a service map signifying which services were invoked by lambda function and indicate the problems, if any. Is that right?

<span class="hernandez">Hernandez></span> Yes, that is right.

<blockquote class="wp-block-quote">
    <p>AWS Lambda function logs are sent to CloudWatch and lambda function needs an IAM role in order to that. Other than CloudWatch, you can also use AWS X-Ray for tracing and debugging performance issues.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### Restrictions with AWS Lambda

<span class="me">Me></span> Jessica, any restrictions around AWS Lambda that we should be aware of?

<span class="jessica">Jessica></span> I think there are a few restrictions - 

+ Maximum unzipped code size for lambda function can be <i>250MB</i>
+ Environment variables can be a maximum of <i>4KB</i> in size
+ Maximum timeout of a lambda function can be <i>15mins</i>
+ Maximum amount of memory that can be allocated to a lambda function can be <i>3GB</i>
+ A lambda function can have a total of <i>5 lambda layers</i>
+ Not all runtime or programming languages are supported by AWS Lambda

With that said, I feel you might not hit all these limitations. To elaborate, if your unzipped code size is going beyond 250MB, I think it is good to understand why is a lambda function getting too huge. Have we packed too many dependencies or have 
we mixed too many responsibilities in a lambda function or is it something else.

<span class="me">Me></span> Jessica, what is lambda layer?

<span class="jessica">Jessica></span> A layer is a ZIP archive that contains libraries, a custom runtime, or other dependencies needed by your application. With layers, you can use libraries in your function without needing to include them in your deployment package. Layers let you keep your deployment package small.

<span class="me">Me></span> Ok, then 5 lambda layers in an application looks like a sensible default.

<span class="jessica">Jessica></span> True. I think these <b>constraints are very sensible</b> and if we are hitting some of them, it is worth looking back and seeing if there is a problem somewhere else. 

<blockquote class="wp-block-quote">
    <p>AWS Lambda has some restrictions and our panel feels these are sensible restrictions. It is good to know them.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### Unit and Integration Testing with AWS Lambda 

<span class="me">Me></span> Coming to my favorite topic. How has your experience been with testing of AWS Lambda function?

<span class="jessica">Jessica></span> Well, <b>unit testing</b> is not difficult. If you are coding your lambda function in typescript, you can very well use [sinon](https://sinonjs.org/) to mock all the dependencies and just validate that a single unit is working fine. 

<span class="hernandez">Hernandez></span> True. I think challenge comes when you want to assert that the integration of your lambda function with external systems say DynamoDB or S3 works properly. In order to test this, we have used <b>LocalStack</b> in our project.    

<span class="me">Me></span> LocalStack? Do you want to talk a bit about this?

<span class="hernandez">Hernandez></span> Sure. [LocalStack](https://github.com/localstack/localstack) provides an easy-to-use test/mocking framework for developing Cloud applications. At this stage, their focus is primarily on supporting the AWS cloud stack.

LocalStack spins up various Cloud APIs on local machine including S3, lambda, DynamoDB and API Gateway. All you need to do is, <b>spin up LocalStack docker container</b>, <b>deploy your infra say Dynamo table or lambda function</b> within LocalStack and <b>connect to these services</b> running on local machine from within your code.   

<span class="me">Me></span> Interesting. Does LocalStack support all AWS services?

<span class="hernandez">Hernandez></span> No, it supports quite a few but definitely not all.

<blockquote class="wp-block-quote">
    <p>I am sure Unit testing with AWS Lambda function code is understood by all of us but what is good to know is <i>LocalStack</i> can be used for integration testing.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### Packaging and deploying an AWS Lambda application

<span class="me">Me></span> Jessica, you talked about unzipped code. Does that mean you have to create a zip file and upload it somewhere?

<span class="jessica">Jessica></span> Well, you have package your lambda function along with its dependencies as an archive, upload it either on AWS Lambda console or in an S3 bucket which will be referenced from your CloudFormation template.

<span class="me">Me></span> How do you folks package your application? It appears to me as if we need to create a "fat jar" kind of a thing.

<span class="hernandez">Hernandez></span> We use [typescript](https://www.typescriptlang.org/) for coding our lambda application and [webpack](https://webpack.js.org/) for packaging it. It does not create a zip file, just an <b>out directory</b> containing the transpiled code (js) and a handler.js file with all the required code from different node_modules plus its source map.

<span class="me">Me></span> How do you deploy your code then because you just seemed to create an output directory with a few javascript files.

<span class="hernandez">Hernandez></span> We use [CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) for deploying our code which allows you to code your infra.

<span class="me">Me></span> Wow, the list of tools doesn't seem to come to an end.

<span class="hernandez">Hernandez></span> It's simple. Just look at it this way, we have just created a directory which is ready to be deployed and moment you say <b>cdk bootstrap</b>, it will copy the contents of this out directory into another directory which will be archived and uploaded to an S3 bucket. 

And when you say <b>cdk deploy</b>, you will see all the required AWS components getting deployed. Simple. 

<span class="me">Me></span>Simple? You said <i>contents of this out directory will be copied into another directory</i>. Does that mean CDK already knows about the out directory?

<span class="hernandez">Hernandez></span> That's true. When you code your infra, you will specify where is your compiled (or transpiled) or ready to be shipped code located and that's how CDK knows about this directory.    

<span class="me">Me></span> Great, now I able to connect dots. Build your code -> get a shippable directory -> archive it -> upload it to an S3 bucket -> deploy it and CDK is one way to get all these steps done. Is that right?  

<span class="hernandez">Hernandez></span> Absolutely.

<blockquote class="wp-block-quote">
    <p>In order to deploy your your lambda function, it needs to be packaged along with its dependencies as an archive. You could use webpack if you are using typescript as a programming language. You can use CDK, CloudFormation or SAM for packaging and deploying your lambda function.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### Applications built using AWS Lambda

<span class="me">Me></span> Jessica, Hernandez, what are the different types of applications that you folks have built using AWS Lambda?

<span class="jessica">Jessica></span> We have actually built <b>serverless microservices</b> using AWS Lambda and we also process <b>web clicks</b> on our application which is a stream of events flowing from user interface to <i>AWS Pinpoint</i> to <i>AWS Kinesis</i> to <i>AWS Lambda</i>. 

<span class="hernandez">Hernandez></span> We use AWS Lambda for <b>scaling down images</b> that are uploaded to our S3 buckets and for processing <b>DynamoDB streams</b> which is a stream of changes in DynamoDB table.

<span class="me">Me></span> Thanks Jessica and Hernandez.

<blockquote class="wp-block-quote">
    <p>Our panel highlighted different types of applications they have built using AWS Lambda including microservices, event processing (images on S3 buckets) and stream processing (web clicks and handling changes in DynamoDB).</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

<i>With this we come to an end of our "Virtual Podcast" and a big Thank you to Jessica and Hernandez for being a part of this.</i> This was wonderful, and hope our readers (yes, it is still virtual) find it the same way. Thank you again. 

### References
+ [Managing AWS Lambda Function Concurrency](https://aws.amazon.com/blogs/compute/managing-aws-lambda-function-concurrency/)
+ [Keeping Functions Warm - How To Fix AWS Lambda Cold Start Issues](https://serverless.com/blog/keep-your-lambdas-warm/)
+ [Provisioned concurrency](https://aws.amazon.com/blogs/aws/new-provisioned-concurrency-for-lambda-functions/)
+ [Lambda Layer](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html)