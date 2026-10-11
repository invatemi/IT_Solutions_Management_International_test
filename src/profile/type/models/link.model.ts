import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Link {
  @Field()
  label!: string;

  @Field()
  url!: string;
}
