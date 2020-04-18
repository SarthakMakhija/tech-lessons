---
layout: post
title: AWS Lambda - A Virtual Podcast
date: 2020-04-18
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
feature-img: "assets/img/pexels/aws-lambda-virtual-podcast.png"
thumbnail: "assets/img/pexels/aws-lambda-virtual-podcast.png"
excerpt: AWS Lambda is a serverless compute service and after having worked with it for sometime, I felt it is a good time for me to share my learning and experiences. I have been thinking of trying to write an article in a "Virtual Podcast format" and felt this could be the one.        
---

<blockquote class="wp-block-quote">
    <p>AWS Lambda is a serverless compute service and after having worked with it for sometime, I felt it is a good time for me to share my learning and experiences. I have been thinking of trying to write an article in a "Virtual Podcast format" and felt this could be the one.</p>
</blockquote>

Welcome all to this article named <i>AWS Lambda - A Virtual Podcast</i> and let me introduce our guests Mr. Hernandez and Ms. Jessica who would walk us through their experiences of using AWS Lambda. 

Welcome Hernandez and Jessica and thank you for participating in this <i>Virtual Podcast</i>. Let's get started.

### What is AWS Lambda 

Me> My first question to you Jessica is "What is AWS Lambda?"

Jessica> AWS Lambda is a <b>serverless compute service</b> which allows you to execute a function in response to various events without provisioning or managing servers. What this means is your function will execute ONLY when there is a request for it.

Me> So what I gather is, a function is an entry point which gets invoked by AWS Lambda service. Is that right? 

Jessica> That's nearly right. When you create a lambda function, you need to specify a handler which is nothing but the <b>filename.exported function name</b> that acts as an entry point for your application. 

Let's say, you have a file named "handler.js" and it exports a function named "processOrders", your handler becomes <b>handler.processOrders</b> which will be invoked by AWS Lambda in response to events.

Me> Thank you Jessica. 

<blockquote class="wp-block-quote">
    <p>AWS Lambda is a serverless compute service which allows you to execute a function in response to various events without provisioning or managing servers. When you create a lambda function, you need to specify a handler which acts as an entry point for your lambda function.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### What is AWS Lambda Cold Start

Me> Hernandez, since a lambda function is not always running, does it add to the response time of a request?

Hernandez> Yes, when running a serverless function, it will stay active as long as it is running. After a period of inactivity, AWS  will drop the container that is running your function which makes your function inactive and this is called as cold state. 

<b>Cold start</b> happens when you execute an inactive function and this delay comes from AWS provisioning your selected runtime container and then running your function.

Me> Is there a way to avoid cold start?

Hernandez> Yes. Recently, AWS introduced <b>Provisioned Concurrency</b> which is designed to keep your functions <b>initialized</b> and ready to respond in double-digit milliseconds at the scale you need. Provisioned concurrency adds pricing dimension though. 

You can turn it ON/OFF from AWS console or CloudFormation.

Me> Thank you Hernandez.

<blockquote class="wp-block-quote">
    <p>Cold start happens when you execute an inactive function and this delay comes from AWS provisioning your selected runtime container and then running your function.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### AWS Lambda Configuration

Me> Jessica, what are the different configuration options one can specify while creating a lambda function?

Jessica> You can specify a lot of options including -
+ IAM role 
+ Memory, which ranges from <i>128MB to 3GB</i> 
+ Timeout, which ranges from <i>1sec to 15mins</i>
+ Environment variables, which can be upto <i>4KB</i> in size
+ VPC configuration for executing your function inside a VPC
+ Concurrency

Me> Wow, these are too many. Jessica you mentioned memory, but no mention of CPU?

Jessica> Yes, you can not control the amount of CPU allocated to your lambda function, it is actually proportional to the amount of memory allocated. 

Me> Jessica, what do you mean by <b>Concurrency</b> of a lambda function?

Jessica> I like the example given in [Managing AWS Lambda Function Concurrency](https://aws.amazon.com/blogs/compute/managing-aws-lambda-function-concurrency/). Imagine each slice of a pizza is an execution unit of a lambda function and the entire pizza represents <i>concurrency pool</i> for all lambda functions in an AWS account. 

Let's say, we set concurrency limit of 100 for a lambda function, all we are saying is the lambda function will have a total of 100 pizza slices which means you can have 100 concurrent executions of lambda function. Concurrency limit set for a lambda function is reduced from concurrency pool, which is 1000 for all lambda functions per AWS account - the entire pizza.            
    
Me> Jessica, I also see an option of <b>Unreserved Concurrency</b> in lambda configuration. What is that?

Jessica> AWS also reserves 100 units of concurrency for all functions that don’t have a specified concurrency limit set. This helps to make sure that future functions have capacity to be consumed.

Me> Thank you Jessica. I am starting to wonder what happens when a lambda functions concurrency limit is reached and there are more requests?

Jessica> Lambda function gets <b>throttled</b> in that case and the behavior of throttling depends on the request type. 

If it is a synchronous request, client receives a timeout error (code 429) and in case of asynchronous request, AWS Lambda (the compute service) retries your lambda function, I think twice, before sending the request event or message to a DLQ, assuming DLQ is configured.

<blockquote class="wp-block-quote">
    <p>Various configuration options can be specified while creating a lambda function including IAM role, memory, timeout, VPC concurrency etc.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>


### AWS Lambda Debugging

Me> Hernandez, what AWS services can help us with debugging an issue with a lambda function?

Hernandez> AWS Lambda function logs are sent to <b>CloudWatch</b> and lambda function needs an IAM role in order to that. Other than CloudWatch, you can also use <b>AWS X-Ray</b> for tracing and debugging performance issues.

Me> Nice. How to set up AWS X-Ray with lambda function? Do you need to set up an X-Ray agent or something like that?

Hernandez> No, with lambda function, you need to do a very few things in order to set up tracing -

+ Set up an <b>IAM role</b> in order to send traces to AWS X-Ray
+ Enable <b>ActiveTracing</b> either in AWS console or CloudFormation
+ Use <b>AWS X-Ray SDK</b> in your lambda function code

Rest everything is taken care by AWS Lambda.

Me> Ok. Once this is done, AWS will be able to build a service map signifying which services were invoked by lambda function and indicate the problems, if any. Is that right?

Hernandez> Yes, that is correct.

Me> Thank you Hernandez.

<blockquote class="wp-block-quote">
    <p>AWS Lambda function logs are sent to CloudWatch and lambda function needs an IAM role in order to that. Other than CloudWatch, you can also use AWS X-Ray for tracing and debugging performance issues.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### Restrictions with AWS Lambda

Me> Jessica, any restrictions around AWS Lambda that we should be aware of?

Jessica> I think there are a few restrictions - 

+ A lambda function can have a total of <i>5 lambda layers</i>
+ Maximum unzipped code size for lambda function can be <i>250MB</i>
+ Environment variables can be a maximum of <i>4KB</i> in size
+ Maximum timeout of a lambda function can be <i>15mins</i>
+ Maximum amount of memory that can be allocated to a lambda function can be <i>3GB</i>
+ Not all runtime or programming languages are supported by AWS Lambda

With that said, I feel you might not hit all these limitations. To elaborate, if your unzipped code size is going beyond 250MB, I think it is good to understand why is a lambda function getting too huge. Have we packed too many dependencies or have 
we mixed too many responsibilities in a lambda function or is it something else.

Me> I guess similar reasoning can go for lambda layers which is a way of distributing shared code across lambda functions.

Jessica> True. I think these <b>constraints are very sensible</b> and if we are hitting some of them, it is worth looking back and seeing if there is a problem somewhere else. 

<blockquote class="wp-block-quote">
    <p>AWS Lambda has some restrictions and our panel feels these are sensible restrictions. It is good to know them.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### Unit and Integration Testing with AWS Lambda 

Me> Coming to my favorite topic. How has your experience been with testing of AWS Lambda function?

Jessica> Well, <b>unit testing</b> is not difficult. If you are coding your lambda function in typescript, you can very well use <i>sinon</i> to mock all the dependencies and just validate that a single unit is working fine. 

Hernandez> True. I think challenge comes when you want to assert that the integration of your lambda function with external systems say DynamoDB or S3 works properly. In order to test this, we have used <b>LocalStack</b> in our project.    

Me> LocalStack? Do you want to talk a bit about this?

Hernandez> Sure. LocalStack provides an easy-to-use test/mocking framework for developing Cloud applications. At this stage, their focus is primarily on supporting the AWS cloud stack.

LocalStack spins up various Cloud APIs on local machine including S3, lambda, DynamoDB and API Gateway. All you need to do is, <b>spin up LocalStack docker container</b> and <b>connect to these services</b> running on local machine from within your code.   

Me> Interesting. Does LocalStack support all AWS services?

Hernandez> No, it supports quite a few but definitely not all.

Me> Thanks Jessica and Hernandez.

<blockquote class="wp-block-quote">
    <p>I am sure Unit testing with AWS Lambda function code is understood by all of us but what is good to know is <i>LocalStack</i> can be used for integration testing.</p>
</blockquote>

<p style="text-align:center"><strong>. . . </strong></p>

### Applications built using AWS Lambda

Me> Jessica, Hernandez, what are the different types of applications that you folks have built using AWS Lambda?

Jessica> We have actually built <b>serverless microservices</b> using AWS Lambda and have processed <b>web clicks</b> on our application. 

Hernandez> We use AWS Lambda for <b>scaling down images</b> that are uploaded to our S3 buckets and for handling <b>DynamoDB streams.</b> 

Me> Thanks Jessica and Hernandez.

<blockquote class="wp-block-quote">
    <p>Our panel highlighted different types of applications they have built using AWS Lambda including microservices, event processing (images on S3 buckets) and stream processing (web clicks and handling changes in DynamoDB).</p>
</blockquote>

<i>Thank you Jessica and Hernandez for being a part of this "Virtual Podcast".</i> This was wonderful, and hope our readers (yes, it is still virtual) find it the same way. Thank you again. 
