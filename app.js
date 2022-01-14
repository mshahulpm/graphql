const { ApolloServer, gql } = require('apollo-server')
const { MockList } = require('@graphql-tools/mock')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')

const typeDefs = gql`
    
   scalar Date
   """ User object """
   type User {
       id: ID!
         name: String!
   }
  """ SkiDay object """
   type SkiDay {
       id: Int!
       date: Date!
       mountain: String!
       """ possible values are 'snowy', 'rainy', 'cloudy','sunny' """
       condition: condition!
   }

   enum condition {
         snowy
            rainy
            sunny
            cloudy
   }

    input AddDayInput{
        date: Date!
        mountain: String!
        condition: condition!
    }

    type RemovePayload {
        removed: Boolean!
    }

    type Query {
        totalDays: Int
        getUser(id: Int!): User
        allDays: [SkiDay!]!
    }
   
    type Mutation {
        addDay(input:AddDayInput!): SkiDay
        removeDay(id: Int): RemovePayload
    }

    type Subscription {
        newDay: SkiDay
    }
`
let days = [{
    id: Math.floor(Math.random() * 101),
    date: new Date(),
    mountain: 'Mount Everest',
    condition: 'sunny'
}]

const mokes = {
    Date: () => new Date(),
    String: () => 'New Mock Data',
    Query: {
        totalDays: () => Math.floor(Math.random() * 101),
        getUser: () => ({
            id: Math.floor(Math.random() * 101),
            name: 'Mock User'
        }),
        allDays: () => new MockList(8)
    },
    Mutation: {
        addDay: () => {
            const newDay = {
                id: Math.floor(Math.random() * 101),
                date: new Date(),
                mountain: 'Mount Everest',
                condition: 'sunny'
            }
            days.push(newDay)
            return newDay
        },
        removeDay: (id) => {
            console.log(id)
            const index = days.findIndex(day => day.id === id)
            if (index === -1) {
                return {
                    removed: false
                }
            }
            days = days.filter(day => day.id !== id)
            return {
                removed: true
            }
        }
    }
}

const resolvers = {

}


const server = new ApolloServer({
    typeDefs,
    mocks: mokes,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})


server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})