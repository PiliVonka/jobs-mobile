import React, { useState, useLayoutEffect } from "react";
import {
  Text,
  FlatList,
  Pressable,
  View,
  Button
} from "react-native";
import { gql, useQuery, NetworkStatus } from "@apollo/client";
import Loading from "./Loading";
import styles from "./styles";
import { SearchBar } from "react-native-elements";

const GET_JOBS = gql`
  query GetJobs($searchValue: String!, $skip: Int) {
    jobs(searchValue: $searchValue, skip: $skip) {
      id
      title
      created
    }
  }
`;

export default ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const { fetchMore, networkStatus, loading, error, data } = useQuery(GET_JOBS, {
    variables: { searchValue, skip: 0, limit: 10 },
    notifyOnNetworkStatusChange: true,
  });

  const [searchText, setSearchText] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerTitle: () => (
        <SearchBar
          inputContainerStyle={{ flex: 1, backgroundColor: "lightgray", }}
          containerStyle={{ height: 55, flex: 1, borderBottomColor: "white", backgroundColor: "white", borderTopColor: "white" }}
          placeholder="Программист"
          value={searchText}
          onSubmitEditing={() => setSearchValue(searchText)}
          onChangeText={setSearchText} />
      ),
    });
  }, [navigation, setSearchText, searchText, setSearchValue, searchValue]);

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
    if (loading || loadingMoreJobs) return;
    fetchMore({
      variables: {
        searchValue,
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
          const { title, created } = job;
          return (
            <Pressable style={styles.item} onPress={() => navigation.navigate("Job", { job })}>
              <Text style={styles.header}>{title}</Text>
              <Text style={styles.subheader}>{new Date(parseInt(created)).toLocaleString("ru-RU")}</Text>
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
