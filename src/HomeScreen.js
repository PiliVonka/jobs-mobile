import React from "react";
import {
  Text,
  FlatList,
  Pressable,
  View,
} from "react-native";
import { gql, useQuery, NetworkStatus } from "@apollo/client";
import Loading from "./Loading";
import styles from "./styles";

const GET_JOBS = gql`
  query GetJobs($searchValue: String!, $skip: Int) {
    jobs(searchValue: $searchValue, skip: $skip) {
      id
      title
      jobDate
    }
  }
`;

export default ({ navigation }) => {
  const { fetchMore, networkStatus, loading, error, data } = useQuery(GET_JOBS, {
    variables: { searchValue: "", skip: 0, limit: 10 },
    notifyOnNetworkStatusChange: true,
  });

  const loadingMoreJobs = networkStatus === NetworkStatus.fetchMore;
  if ((loading || loadingMoreJobs) && (!error && !data)) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
      <Text>
        {JSON.stringify(error)}
      </Text>
    );
  }

  const { jobs } = data;
  const loadMoreJobs = () => {
    console.log("Loading more jobs..");
    if (loading || loadingMoreJobs) return;
    fetchMore({
      variables: {
        searchValue: "",
        skip: jobs.length,
        limit: 10
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          jobs: [...prev.jobs, ...fetchMoreResult.jobs]
        };
      }
    });
  };

  return (
    <View style={styles.centered}>
      <FlatList
        data={jobs}
        renderItem={({ item: job }) => {
          const { title, jobDate } = job;
          return (
            <Pressable style={styles.item} onPress={() => navigation.navigate("Job", { job })}>
              <Text style={styles.header}>{title}</Text>
              <Text style={styles.subheader}>{jobDate}</Text>
            </Pressable>
          );
        }}
        onEndReachedThreshold={1}
        onEndReached={() => {
          loadMoreJobs();
        }}
        keyExtractor={(job) => job.id}
      />
    </View>
  );
};
