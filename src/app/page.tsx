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
      { codigo: '35M12', professor: 'Professor A' }
    ],
    cor: '#f39c12'  // Cor laranja para Cálculo 3
  },
  {
    nome: 'Sinais de Sistemas em TC',
    horarios: [
      { codigo: '35N34', professor: 'Professor B' },
      { codigo: '35M12', professor: 'Professor J' }
    ],
    cor: '#27ae60'  // Cor verde para Sinais de Sistemas
  },
  {
    nome: 'Tecnica de Programação 1',
    horarios: [
      { codigo: '35T34', professor: 'Professor C' }
    ],
    cor: '#2980b9'  // Cor azul para Técnica de Programação
  },
  {
    nome: 'Introducao a Circuitos Eletricos',
    horarios: [
      { codigo: '24M12', professor: 'Professor D' }
    ],
    cor: '#8e44ad'  // Cor roxa para Circuitos Elétricos
  },
  {
    nome: 'Sistemas Digitais',
    horarios: [
      { codigo: '246M12', professor: 'Professor E' }
    ],
    cor: '#e74c3c'  // Cor vermelha para Sistemas Digitais
  },
  {
    nome: 'Laboratorio de Sinais Digitais',
    horarios: [
      { codigo: '35M34', professor: 'Professor F' }
    ],
    cor: '#16a085'  // Cor verde-água para Lab de Sinais Digitais
  }
];

const HomePage: React.FC = () => {
  const [grade, setGrade] = useState<Cell[][]>(Array(6).fill('').map(() => Array(5).fill({})));
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
          return horario ? { materia, cor } : cell;  // Armazena a cor e a matéria
        })
      );
      setGrade(newGrade);
    }
  };

  const handleCellClick = (materia: string) => {
    const newGrade = grade.map((row) =>
      row.map((cell) => (cell.materia === materia ? {} : cell))
    );
    setGrade(newGrade);
  };

  // Decodifica o código para retornar os dias e horários (linhas e colunas) correspondentes
  const decodeCodigo = (codigo: string) => {
    const regex = /(\d+)([MTN])(\d+)/; // Ex: 24M12 ou 35T34
    const match = codigo.match(regex);

    if (!match) {
      return [];
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
    } else {
      return []; // Código inválido
    }

    const diasColunas = dias.map(dia => diasMapping[dia]); // Transforma o dia em coluna

    const result = [];
    for (const linha of linhas) {
      for (const coluna of diasColunas) {
        result.push({ row: linha, col: coluna });
      }
    }

    return result;
  };

  return (
    <>
      <Navbar limparGrade={() => setGrade(Array(6).fill('').map(() => Array(5).fill({})))} salvarGrade={() => console.log('Grade salva!')} />

      

      {/* Tabela da grade */}
      <div className={styles.gradeContainer}>
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
            {['08:00 - 09:50', '10:00 - 11:50', '14:00 - 15:50', '16:00 - 17:50', '19:00 - 20:40', '20:50 - 22:30'].map(
              (horario, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{horario}</td>
                  {grade[rowIndex].map((cell: Cell, colIndex: number) => (
                    <td
                    key={colIndex}
                    className={styles.cell}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => handleCellClick(cell.materia || '')}  // Remove todas as células da matéria
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
    </>
  );
};

export default HomePage;