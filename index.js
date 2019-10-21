const express = require('express');

const server = express();

server.use(express.json());

var requisicoes = 0;
const projects = [
  { id: "1", title: "Novo Projeto 1", tasks: []}
];

// Middleware para contagens das requisições
server.use((req, res, next) => {
  requisicoes++;
  console.log(`Total de requisições: ${requisicoes};`);

  next();
});

// Middleware para verificar se existe projeto 
function checkProjectInArray(req, res, next) {
  const index = projects.findIndex(project => project.id == req.params.id)
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

/**
 * Retorna todos os projetos
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
})

/**
 * Altera o titulo do projeto passando sua id e title
 */
server.put('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex(project => project.id == id);
  projects[index].title = title;
  
  return res.json(projects[index]);
})

/**
 * Deleta projeto passando sua id
 */
server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id == id);
  
  projects.splice(index, 1)

  return res.send();
})

/**
 * Adiciona uma nova tarefa ao projeto passando sua id e tasks
 */
server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;
  const index = projects.findIndex(project => project.id == id);
  
  projects[index].tasks.push(tasks);
  return res.json(projects[index]);
})


server.listen(3000);