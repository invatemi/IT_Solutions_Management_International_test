import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Проект.
 */
@ObjectType()
export class Project {
  @Field()
  name!: string;

  @Field()
  url!: string;
}
