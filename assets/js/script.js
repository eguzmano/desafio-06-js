const input = document.querySelector("input");
const select = document.querySelector("select");
const btn = document.querySelector("button");
const result = document.querySelector(".result");
const graphic = document.querySelector(".graphic");
let chartInstance;

const getData = async (moneda) => {
  try {
    const res = await fetch(`https://mindicador.cl/api/${moneda}`);
    const data = await res.json();
    return data;
  } catch (error) {
    result.innerHTML = `Algo salió mal! Error: ${error.message}`;
  }
};

btn.addEventListener("click", async () => {
  const userAmount = input.value;
  const exchangeData = await getData(`${select.value}`);
  const exchangeRate = exchangeData.serie[0].valor;
  const convertedAmount = (userAmount / exchangeRate).toFixed(2);
  result.innerHTML = `
  Resultado: ${convertedAmount}
  `;
  renderGraphic();
});

const graphicData = async () => {
  const data = await getData(`${select.value}`);
  const labels = data.serie
    .map((moneda) => new Date(moneda.fecha).toLocaleDateString("es-CL"))
    .reverse();
  const values = data.serie.map((moneda) => moneda.valor).reverse();

  const datasets = [
    {
      label: `Valor ${select.value.toUpperCase()} en los últimos días`,
      borderColor: "#ff0000",
      data: values,
      fill: true,
    },
  ];
  return { labels, datasets };
};

const renderGraphic = async () => {
  const data = await graphicData();

  if (chartInstance) {
    chartInstance.destroy();
  }

  const config = {
    type: "line",
    data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Fecha",
          },
        },
        y: {
          title: {
            display: true,
            text: "Valor",
          },
        },
      },
    },
  };

  // Crear un nuevo gráfico
  const ctx = graphic.getContext("2d");
  chartInstance = new Chart(ctx, config);
};
