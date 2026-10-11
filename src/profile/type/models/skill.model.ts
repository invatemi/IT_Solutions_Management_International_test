import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Skill {
  @Field()
  name!: string;
}
