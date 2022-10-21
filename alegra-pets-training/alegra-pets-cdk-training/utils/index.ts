import { StackProps } from "aws-cdk-lib"
import { StackBasicProps } from "../interface";

export function getDefaultResourceName(props:StackBasicProps,name:string){
    return `${props.name}-${name}-${props.environment}`;
}
  
export function getCdkPropsFromCustomProps(props:StackBasicProps){
    return {
        stackName: props.name,
        env:{
          account:props.account,
          region:props.region
        },
      };
  }
  