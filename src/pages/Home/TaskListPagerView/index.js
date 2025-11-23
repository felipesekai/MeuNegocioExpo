import React, { useMemo, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Background } from '../../../utils/Style';
import LoaderOverlay from '../../../components/LoaderOverlay';
import ListEmpty from '../../../components/ListEmpty';
import { useTasks } from '../../../hooks/useTasks';
import { confirmDialog } from '../../../utils/dialogs';
import { useTheme } from 'styled-components';

const TaskItem = ({ item, onToggle, onDelete }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[styles.item, { borderColor: theme.borderColor, backgroundColor: theme.surfaceColor }]}
      onPress={() => onToggle(item.id)}
      onLongPress={() => onDelete(item.id)}
      accessibilityLabel={`Tarefa ${item.title}`}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.textColor, textDecorationLine: item.done ? 'line-through' : 'none' }]}>
          {item.title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted || theme.textColor }]}>
          {item.done ? 'Concluída' : 'Pendente'}
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: item.done ? theme.success : theme.primaryColor }]}>
        <Text style={[styles.badgeText, { color: theme.textOnPrimary }]}>{item.done ? '✔' : '•'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const TaskListPagerView = () => {
  const [newTask, setNewTask] = useState('');
  const { tasks, loading, mutating, addTask, toggleTask, deleteTask } = useTasks();
  const theme = useTheme();

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.done === b.done) return b.createdAt - a.createdAt;
      return a.done ? 1 : -1;
    });
  }, [tasks]);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    await addTask(newTask.trim());
    setNewTask('');
  };

  const handleDelete = (id) => {
    confirmDialog({
      title: 'Excluir tarefa?',
      message: 'Esta ação não pode ser desfeita.',
      onConfirm: () => deleteTask(id),
    });
  };

  return (
    <Background>
      <View style={{ padding: 12 }}>
        <TextInput
          placeholder="Nova tarefa"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          style={[
            styles.input,
            {
              borderColor: theme.borderColor || theme.primaryColor,
              backgroundColor: theme.surfaceColor || '#fff',
              color: theme.textColor,
            },
          ]}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primaryColor }]} onPress={handleAdd}>
          <Text style={[styles.addText, { color: theme.textOnPrimary || '#fff' }]}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem item={item} onToggle={toggleTask} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<ListEmpty message="Sem tarefas ainda." />}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 32 }}
      />
      <LoaderOverlay visible={loading || mutating} />
    </Background>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  addButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addText: {
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 16,
  },
});

export default TaskListPagerView;
