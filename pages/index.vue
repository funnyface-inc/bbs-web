<template>
  <v-container class="lighten-5 mb-6" >

    <v-dialog v-model="isOpenDialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="ma-2" outlined color="lime" v-bind="attrs" v-on="on" >
          新規投稿
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          <span class="headline">投稿内容</span>
        </v-card-title>
        <v-card-text>
          <v-text-field placeholder="タイトル" outlined v-model="title"></v-text-field>
          <v-text-field placeholder="https://sample.png" outlined v-model="image"></v-text-field>
          <v-textarea outlined hint="投稿内容" v-model="description"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="this.onCreateTopic">
            投稿する
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="12" sm="4" md="4" v-for="(topic, index) in topics" :key="index" >
        <v-card class="pa-2" outlined tile >
          <v-img :src="topic.image" ></v-img>
          <v-card-title>
            {{ topic.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ topic.description }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component, State, Action } from 'nuxt-property-decorator';
import _ from 'lodash';

@Component
export default class Topic extends Vue {

  isOpenDialog: boolean = false;
  title: string = '';
  description: string = '';
  image: string = '';

  @State(state => state.topic.topics) topics
  @State(state => state.topic.topic) topic
  @Action('topic/createTopic') createTopic :any

  async fetch({ app, store }) {
    await store.dispatch('topic/fetchTopics', { apollo: app.apolloProvider.defaultClient });
  }

  async onCreateTopic() {
    this.isOpenDialog = false;
    const topic = {
      title: this.title,
      description: this.description,
      image: this.image,
    };
    await this.createTopic({ apollo: this.$apolloProvider.defaultClient, topic });
  }
}
</script>
