import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Навык.
 */
@ObjectType()
export class Skill {
  @Field()
  name!: string;
}
