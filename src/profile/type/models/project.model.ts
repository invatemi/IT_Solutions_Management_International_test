import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field()
  name!: string;

  @Field()
  url!: string;
}
