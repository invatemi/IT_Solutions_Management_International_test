import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Experience {
  id!: number;

  @Field()
  company!: string;

  @Field()
  position!: string;

  @Field()
  startDate!: string;

  @Field(() => String, { nullable: true })
  endDate!: string | null;
}
