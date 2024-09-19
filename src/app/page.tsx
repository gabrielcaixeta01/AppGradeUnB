'use client';

import React, { useState } from 'react';
import styles from '../styles/page.module.css';
import Navbar from '../components/Navbar'; // Importando a navbar

interface Horario {
  codigo: string;
  professor: string;
}

interface Materia {
  nome: string;
  horarios: Horario[];
  cor: string;
}

interface Cell {
  materia?: string;
  cor?: string;
  codigo?: string;  // Adiciona o código à célula
}

const diasMapping: { [key: string]: number } = {
  '2': 0, // Segunda = Coluna 0
  '3': 1, // Terça = Coluna 1
  '4': 2, // Quarta = Coluna 2
  '5': 3, // Quinta = Coluna 3
  '6': 4  // Sexta = Coluna 4
};

const materias: Materia[] = [
  {
    nome: 'Cálculo 3',
    horarios: [
      { codigo: '2M1234 4M12', professor: 'Luiz Claudio Pereira' },
      { codigo: '235M34', professor: 'Claus Akira Matsushigue' },
      { codigo: '356M12', professor: 'Mateus Figueiredo de Souza' },
      { codigo: '356M12', professor: 'Nathalia Nogueira Goncalves' },
      { codigo: '235M34', professor: 'Julia Aredes de Almeida' },
      { codigo: '246T23', professor: 'Pedro Roitman' },
      { codigo: '356M12', professor: 'Victor Petrogradskyi' },
      { codigo: '2N12 35N34', professor: 'Ricardo Parreira da Silva' },
      { codigo: '235T45', professor: 'Vinicius de Carvalho Rispoli' },
      { codigo: '235M34', professor: 'Matheus Bernardini de Souza' }
    ],
    cor: '#f39c12'  // Cor laranja para Cálculo 3
  },
  {
    nome: 'Técnicas de Programação 1',
    horarios: [
      { codigo: '35N34', professor: 'Fernando Antonio de Araujo Chacon de Albuquerque' },
      { codigo: '35M34', professor: 'Fernando Antonio de Araujo Chacon de Albuquerque' },
      { codigo: '35M34', professor: 'Roberta Barbosa Oliveira' }
    ],
    cor: '#2980b9'  // Cor azul para Técnicas de Programação 1
  },
  {
    nome: 'Introdução aos Circuitos Elétricos',
    horarios: [
      { codigo: '6M12', professor: 'Joao Paulo Leite' },
      { codigo: '6M34', professor: 'Joao Paulo Leite' },
      { codigo: '4T23', professor: 'Daniel Orquiza de Carvalho' },
      { codigo: '3M12', professor: 'Daniel Orquiza de Carvalho' }
    ],
    cor: '#8e44ad'  // Cor roxa para Introdução aos Circuitos Elétricos
  },
  {
    nome: 'Sinais e Sistemas em Tempo Contínuo',
    horarios: [
      { codigo: '24M34', professor: 'Robson Domingos Vieira' },
      { codigo: '35M34', professor: 'Lelio Ribeiro Soares Junior' },
      { codigo: '35T23', professor: 'Flavia Maria Guerra de Sousa Aranha Oliveira' },
      { codigo: '24T45', professor: 'Joao Luiz Azevedo de Carvalho' }
    ],
    cor: '#27ae60'  // Cor verde para Sinais e Sistemas em Tempo Contínuo
  },
  {
    nome: 'Sistemas Digitais',
    horarios: [
      { codigo: '35T45', professor: 'Edson Mitsu Hung' },
      { codigo: '24M34', professor: 'Guilherme de Sousa Torres' },
      { codigo: '24T45', professor: 'Daniel Chaves Cafe' }
    ],
    cor: '#e74c3c'  // Cor vermelha para Sistemas Digitais
  },
  {
    nome: 'Laboratório de Sistemas Digitais',
    horarios: [
      { codigo: '2M34', professor: 'Luis Fernando Ramos Molinaro' },
      { codigo: '2T23', professor: 'Luis Fernando Ramos Molinaro' },
      { codigo: '3T45', professor: 'Guilherme de Sousa Torres' },
      { codigo: '4T45', professor: 'Guilherme de Sousa Torres' },
      { codigo: '6M12', professor: 'Luis Fernando Ramos Molinaro' },
      { codigo: '6M34', professor: 'Luis Fernando Ramos Molinaro' },
      { codigo: '3T23', professor: 'Guilherme de Sousa Torres' }
    ],
    cor: '#16a085'  // Cor verde-água para Laboratório de Sistemas Digitais
  }
];

const HomePage: React.FC = () => {
  const [grade, setGrade] = useState<Cell[][]>(Array(7).fill('').map(() => Array(5).fill({})));
  let dragIcon: HTMLDivElement | null = null; // Variável para armazenar o ícone de arraste

  const handleDragStart = (e: React.DragEvent, materia: string, codigo: string, cor: string) => {
    e.dataTransfer.setData('materia', materia);
    e.dataTransfer.setData('codigo', codigo);
    e.dataTransfer.setData('cor', cor);  // Passa a cor da matéria

    // Cria uma cópia do elemento para ser usada durante o drag
    dragIcon = document.createElement('div');
    dragIcon.style.width = '100px';  // Ajuste o tamanho conforme necessário
    dragIcon.style.height = '30px';
    dragIcon.style.backgroundColor = cor;  // Cor de fundo da matéria
    dragIcon.style.color = '#fff';  // Cor do texto
    dragIcon.style.display = 'flex';
    dragIcon.style.alignItems = 'center';
    dragIcon.style.justifyContent = 'center';
    dragIcon.style.borderRadius = '8px';  // Adiciona o border-radius
    dragIcon.style.border = '1px solid #123163';  // Adiciona uma borda ao ícone arrastado
    dragIcon.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';  // Sombra para suavidade
    dragIcon.innerHTML = codigo;  // Exibe o código no ícone
    document.body.appendChild(dragIcon);

    e.dataTransfer.setDragImage(dragIcon, 50, 15);  // Define a posição do ícone
  };

  const handleDragEnd = () => {
    if (dragIcon) {
      document.body.removeChild(dragIcon); // Remove o ícone de arraste ao término
      dragIcon = null;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    const materia = e.dataTransfer.getData('materia');
    const codigo = e.dataTransfer.getData('codigo');
    const cor = e.dataTransfer.getData('cor');  // Obtém a cor da matéria
  
    const horarios = decodeCodigo(codigo);
    
    // Verifique se todos os horários estão disponíveis
    if (horarios.every(({ row, col }) => grade[row]?.[col]?.materia === undefined)) {
      const newGrade = grade.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const horario = horarios.find(h => h.row === rIdx && h.col === cIdx);
          // Se for um dos horários, armazene a matéria, código e cor
          return horario ? { materia, codigo, cor } : cell;
        })
      );
      setGrade(newGrade);
    }
  };

  const handleCellClick = (materia: string, codigo: string) => {
    const newGrade = grade.map((row) =>
      row.map((cell) => {
        // Remove todas as células que tenham a mesma matéria e código
        return cell.materia === materia && cell.codigo === codigo ? {} : cell;
      })
    );
    setGrade(newGrade);
  };

  // Decodifica o código para retornar os dias e horários (linhas e colunas) correspondentes
  const decodeCodigo = (codigo: string): { row: number, col: number }[] => {
    const result: { row: number, col: number }[] = []; // Define explicitamente o tipo de 'result'
  
    // Quebra o código em partes separadas, por exemplo, "2M1234 4M12" vira ["2M1234", "4M12"]
    const partes = codigo.split(' ');
  
    partes.forEach((parte) => {
      const regex = /(\d+)([MTN])(\d+)/; // Ex: 24M12 ou 35T34
      const match = parte.match(regex);
  
      if (!match) {
        return;
      }
  
      const dias = match[1].split(''); // Pega os dias (ex.: 24 se transforma em ['2', '4'])
      const periodo = match[2]; // M (manhã), T (tarde), N (noite)
      const horarios = match[3]; // Ex.: 12 (primeiro e segundo horário)
  
      // Determina as linhas baseadas no período e horário
      let linhas: number[];
      if (horarios === '12') {
        linhas = periodo === 'M' ? [0] : periodo === 'T' ? [2] : [4]; // Primeiro horário do período
      } else if (horarios === '34') {
        linhas = periodo === 'M' ? [1] : periodo === 'T' ? [3] : [5]; // Segundo horário do período
      } else if (horarios === '1234') {
        linhas = periodo === 'M' ? [0, 1] : periodo === 'T' ? [2, 3] : [4, 5]; // Primeiro e segundo horário
      } else if (horarios === '1') {
        linhas = [2]; // Primeiro horário da tarde (12:00 - 13:50) -> T1
      } else if (horarios === '23') {
        linhas = [3]; // Segundo horário da tarde (14:00 - 15:50) -> T23
      } else if (horarios === '45') {
        linhas = [4]; // Terceiro horário da tarde (16:00 - 17:50) -> T45
      } else {
        return; // Código inválido
      }
  
      const diasColunas = dias.map(dia => diasMapping[dia]); // Transforma o dia em coluna
  
      // Para cada combinação de dia e linha, adiciona ao resultado
      for (const linha of linhas) {
        for (const coluna of diasColunas) {
          result.push({ row: linha, col: coluna });
        }
      }
    });
  
    return result;
  };

  return (
    <>
      <Navbar limparGrade={() => setGrade(Array(6).fill('').map(() => Array(5).fill({})))} salvarGrade={() => console.log('Grade salva!')} />

      
      <div className={styles.container}>
        <div className={styles.gradeContainer}>
          <p>Grade de Aulas</p>
          <table className={styles.grade}>
            <thead>
              <tr>
                <th>Horário</th>
                <th>Segunda</th>
                <th>Terça</th>
                <th>Quarta</th>
                <th>Quinta</th>
                <th>Sexta</th>
              </tr>
            </thead>
            <tbody>
              {['08:00 - 09:50', '10:00 - 11:50', '12:00 - 13:50','14:00 - 15:50', '16:00 - 17:50', '19:00 - 20:40', '20:50 - 22:30'].map(
                (horario, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{horario}</td>
                    {grade[rowIndex].map((cell: Cell, colIndex: number) => (
                      <td
                      key={colIndex}
                      className={styles.cell}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => handleCellClick(cell.materia || '', cell.codigo || '')}  // Remove todas as células da matéria e código
                      style={{ backgroundColor: cell?.cor || '#f9f9f9', color: cell?.cor ? 'white' : '#333' }}
                    >
                      {cell?.materia || ''}  {/* Exibe o nome da matéria */}
                    </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.materiaList}>
          {materias.map((materia, idx) => (
            <div key={idx} className={styles.materiaCard} style={{ backgroundColor: materia.cor }}>
              <h3>{materia.nome}</h3>
              <ul>
                {materia.horarios.map((h, hIdx) => (
                  <li
                    key={hIdx}
                    className={styles.horarioItem}
                    draggable
                    onDragStart={(e) => handleDragStart(e, materia.nome, h.codigo, materia.cor)}
                    onDragEnd={handleDragEnd} 
                  >
                    {h.codigo}
                    <span className={styles.professorHover}>{h.professor}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      
    </>
  );
};

export default HomePage;