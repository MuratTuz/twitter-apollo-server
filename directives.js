import apollo from "apollo-server";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver, GraphQLString } from "graphql";
import { formatDate } from "./utils.js";

const { AuthenticationError } = apollo;
//const { SchemaDirectiveVisitor } = schema;

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const { format } = this.args;

    field.resolve = async (...args) => {
      const result = await resolver.apply(this, args);
      return formatDate(result, format);
    };

    field.type = GraphQLString;
  }
}

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    field.resolve = async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("Not authenticated");
      }
      return resolver(parent, args, context);
    };
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const { role } = this.args;

    field.resolve = async (parent, args, context) => {
      if (context.user.role !== role) {
        throw new AuthenticationError("Wrong Role");
      }

      return resolver(parent, args, context);
    };
  }
}

export { FormatDateDirective, AuthenticationDirective, AuthorizationDirective };
