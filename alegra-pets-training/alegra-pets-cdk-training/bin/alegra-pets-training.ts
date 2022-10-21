#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGWStack } from '../lib/ApiGWStack';
import { BucketS3Stack } from '../lib/BucketS3Stack';
import { LambdaStack } from '../lib/LambdaStack';
import { DynamoDBStack } from '../lib/DynamoDBStack';


const app = new cdk.App();

const appName = "alegra-pets"
const account = app.node.tryGetContext('account-id');
const environment = app.node.tryGetContext('env');


if(account === undefined || environment === undefined ){
  throw new Error("Env or environment not suppored");
}


const propsDefaultStack = {
  account,
  region:"us-east-1",
  environment
}



const DynamoDB = new DynamoDBStack (app,"DynamoDBStack",{
  ...propsDefaultStack,
  name: `${appName}-DynamoDBStack`
})

const lambdaStack = new LambdaStack(app,"Lambda",{
  ...propsDefaultStack,
  name: `${appName}-lambdaStack`,
  DynamoDBStack:DynamoDB
})

new BucketS3Stack(app,"S3",{
  ...propsDefaultStack,
  lambdaStack,
  name: `${appName}-s3stack`
});


new ApiGWStack(app,"ApiGWStack",{
  ...propsDefaultStack,
  lambdaStack,
  name: `${appName}-ApiGWStack`

})



/* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */


  