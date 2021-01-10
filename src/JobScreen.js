import React from "react";
import { View, Text, ScrollView } from "react-native";
import { gql, useQuery } from "@apollo/client";

import Loading from "./Loading";
import styles from "./styles";

const GET_JOB = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      title
      jobDate
      description
      phone
      location
    }
  }
`;

export default ({ route }) => {
  console.log({ id: route.params.job.id });
  const { data, loading, error } = useQuery(GET_JOB, {
    variables: { id: route.params.job.id },
  });
  console.log({ data, loading, error });
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Text>
        {JSON.stringify(error)}
      </Text>
    );
  }

  const { title, jobDate, description, phone, location } = data.job;
  return (
    <View style={styles.jobPage}>
     <ScrollView style={styles.scrollView}>
      <Text style={styles.header}> {title} </Text>
      <Text style={styles.subheader}> {jobDate} </Text>
      <Text style={styles.item}> {description} </Text>
      <Text> {phone} </Text>
      <Text> {location} </Text>
      </ScrollView>
    </View>
  );
};
