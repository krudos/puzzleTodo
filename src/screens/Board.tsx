import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../components/Button";
import { FlatListItem } from "../components/FlatListItem";
import { useShowAddTask } from "../navigation";
import { Container } from "../utils/styled";
import { Todo, useTodos } from "../utils/TodoContext";
import styled from "styled-components";

const filters = ["All", "Completed", "Uncompleted", "Favorite"] as const;
type Filter = typeof filters[number];

export const Board = () => {
  const [filter, setFilter] = useState<Filter>("All");
  const showAddTask = useShowAddTask();
  const { allTodo } = useTodos();

  const data = useMemo(() => {
    switch (filter) {
      case "All":
        return allTodo;
      case "Completed":
        return allTodo.filter((value) => value.completed);
      case "Uncompleted":
        return allTodo.filter((value) => !value.completed);
      case "Favorite":
        return allTodo.filter((value) => value.favorite);
    }
  }, [allTodo, filter]);

  const changeFilter = useCallback(
    (filterName: Filter) => {
      if (filterName !== filter) {
        setFilter(filterName);
      }
    },
    [setFilter, filter]
  );
  return (
    <MainContainer>
      <FilterArea>
        {filters.map((item) => (
          <FilterButton onPress={() => changeFilter(item)} key={item}>
            <FilterText selected={item === filter}>{item}</FilterText>
            <UnderLine selected={item === filter} />
          </FilterButton>
        ))}
      </FilterArea>
      <Container>
        <TodoFlatList
          keyExtractor={(item: Todo, index: number) => item.title + index}
          data={data}
          renderItem={({ item }: { item: Todo }) => (
            <FlatListItem item={item} />
          )}
          ListEmptyComponent={() => <Text>No tasks</Text>}
        />
        <Button title="Add a task" onPress={showAddTask} />
      </Container>
    </MainContainer>
  );
};

const MainContainer = styled.View`
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: ${(props) => props.theme.white};
  flex: 1;
`;
const FilterArea = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  padding-top: 10px;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-color: ${(props) => props.theme.gray};
`;

const UnderLine = styled.View`
  background-color: ${(props) =>
    props.selected ? props.theme.black : props.theme.transparent};
  height: 3px;
`;

const TodoFlatList = styled.FlatList`
  padding-top: 10px;
`;

const FilterButton = styled.TouchableOpacity`
  margin-left: 10px;
  margin-right: 10px;
`;

const FilterText = styled.Text`
  color: ${(props) => (props.selected ? props.theme.black : props.theme.gray)};
`;
