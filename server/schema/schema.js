const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList } = graphql;

// dummy data
let books = [
  { name: 'Name of the wind', genre: 'fantasy', id: '1', authorId: '1' },
  { name: 'book two', genre: 'fantasy', id: '2', authorId: '2' },
  { name: 'book three', genre: 'fantasy', id: '3', authorId: '3' },
  { name: 'book four', genre: 'fantasy', id: '4', authorId: '2' },
  { name: 'book 5', genre: 'fantasy', id: '5', authorId: '3' },
  { name: 'book 6', genre: 'fantasy', id: '6', authorId: '3' },

]

let authors = [
  { name: 'phillip choi', age: 26, id: '1' },
  { name: 'yoojung kim', age: 28, id: '2' },
  { name: 'yoonyung jung', age: 25, id: '3' },
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, { id: parent.authorId })
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log(parent);
        return _.filter(books, { authorId: parent.id })
      }
    }
  })
});


const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db / other source
        return _.find(books, { id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id })
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})