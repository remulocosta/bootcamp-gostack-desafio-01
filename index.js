const express = require('express');

const server = express();

server.use(express.json());

var requisicoes = 0;
const projects = [
  { id: "1", title: "Novo Projeto 1", tasks: []}
];

// Middleware global
server.use((req, res, next) => {
  requisicoes++;
  console.log(`Total de requisições: ${requisicoes};`);

  next();
});

// Middleware local
function checkProjectInArray(req, res, next) {
  const index = projects.findIndex(projects => projects.id === req.params.id)
  const project = projects[index];

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  return next();
}

server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({id, title, tasks});
 
  return res.json(projects);
})

//Rota que lista todos projetos e suas tarefas;
server.get('/projects', (req, res) => {
  return res.json(projects);
})

// A rota deve alterar apenas o título do projeto com o id;
server.put('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex(projects => projects.id === id);
  projects[index].title = title;
  
  return res.json(projects[index]);
})

//A rota deve deletar o projeto com o id;
server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(projects => projects.id === id);
  
  projects.splice(index, 1)

  return res.send();
})

//armazena uma nova tarefa no array de tarefas de um projeto id;
server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;
  const index = projects.findIndex(projects => projects.id === id);
  
  projects[index].tasks.push(tasks);
  return res.json(projects[index]);
})


server.listen(3000);