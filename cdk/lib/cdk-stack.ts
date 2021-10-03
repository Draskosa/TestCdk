import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment'; 
import { FromCloudFormationResult } from '@aws-cdk/core/lib/cfn-parse';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
 
export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //S3
    const bucket = new s3.Bucket(this,"CdkTestBucket", {
      publicReadAccess: true,
      websiteIndexDocument: "index.html"
    });

    // The code that defines your stack goes here
    // Deployment
    new s3Deployment.BucketDeployment(this, "CdkDeploymentBucket", {
      sources: [s3Deployment.Source.asset("../build")],
      destinationBucket: bucket
    });

    // CF

    const distrubtion = new cloudfront.CloudFrontWebDistribution(this,'CfDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
               s3BucketSource: bucket
            },
            behaviors : [ {isDefaultBehavior: true}]
          }
        ]
    });
        

  }
}
