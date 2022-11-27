import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface CacheTableProps {
  tableName: string;
}

export default class CacheTable extends Table {
  constructor(scope: Construct, id: string, props: CacheTableProps) {
    super(scope, id, {
      partitionKey: {
        name: "crawlId",
        type: AttributeType.STRING,
      },
      tableName: props.tableName,
      timeToLiveAttribute: "ttl",
    });
  }
}
