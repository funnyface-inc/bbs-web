/**
 * @fileoverview topic.ts
 * @name topic.ts
 * @author Yoshiya Ito <myon53@gmail.com>
 */
import _ from 'lodash';
import gql from 'graphql-tag'
import { Module, VuexModule, MutationAction } from 'vuex-module-decorators'

interface Topic {
  id: number
  title: string
  description: string
}

@Module({
  name: 'topics',
  stateFactory: true,
  namespaced: true,
})
export default class TopicModule extends VuexModule {

  topics: Topic[] = [];
  topic: Topic = { id: 0, title: '', description: '' };

  @MutationAction({ mutate: ['topics'] })
  async fetchTopics(context: any) {
    try {
      const response = await context.apollo.query({ query: gql`
        {
          topics {
            edges {
              node {
                id
                title
                description
                image
                createdAt
                updatedAt
              }
            }
          }
        }
      `,
      });
      const topics = _.map(response.data.topics.edges, (edge) => {
        return {
          id: edge.node.id,
          name: edge.node.title,
          description: edge.node.description,
          image: edge.node.image,
        };
      });
      return { topics };
    } catch (e) {
      console.log(e.networkError.result.errors)
      return { topics: [] };
    }
  }

  @MutationAction({ mutate: ['topic'] })
  async createTopic(context: any) {
    try {
      const response = await context.apollo.mutate({
        variables: {
          title: context.topic.title,
          description: context.topic.description,
          image: context.topic.image,
        },
        mutation: gql`
          mutation CreateTopic($title: String!, $description: String!, $image: String!) {
            createTopic(input: { title: $title, description: $description, image: $image}) {
              topic {
                id
                title
                image
                description
              }
            }
          }
        `,
      });
      return { topic: {} };
    } catch (e) {
      console.log(e.networkError.result.errors)
      return { topic:{} };
    }
  }
}
