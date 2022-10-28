import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as sns from "aws-cdk-lib/aws-sns";
import { getCdkPropsFromCustomProps, getDefaultResourceName } from "../utils";
import { SnsStackCustom } from "../interface";
import { CfnOutput } from "aws-cdk-lib";


export class SnsStack extends cdk.Stack{
    constructor(scope:Construct,id:string,props:SnsStackCustom){

        super(scope,id,getCdkPropsFromCustomProps(props))

        const { adoptPet } = props.lambdaStack;

        const myTopic = new sns.Topic(this, "pet-happy",{
            topicName:"pet-happy"
        });

        myTopic.addSubscription(new subscriptions.EmailSubscription(props.EmailLeader));

        myTopic.grantPublish(adoptPet);

        new CfnOutput(this,'output-topic-sns-pet-happy-arn',{
            value:myTopic.topicArn,
            exportName:'output-topic-sns-pet-happy-arn'
        })

    }
}