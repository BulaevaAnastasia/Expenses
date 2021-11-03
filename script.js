let allExpenses = [];
let valueInputWhere = '';
let valueInputCount = '';
let inputWhere = null;
let inputCount = null;
let editInd = null;
const baseUrl = 'http://localhost:8000/';

const onClickButton = async () => {
    let date = new Date;
    if (valueInputWhere && valueInputCount) {
        const response = await fetch(`${baseUrl}saveExpense`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                store: valueInputWhere,
                date: date,
                sum: valueInputCount
            })
        });
        let result = await response.json();
        allExpenses = result.data;
        valueInputWhere = '';
        valueInputCount = '';
        inputWhere.value = '';
        inputCount.value = '';
        render();
    };
};

window.onload = async function init() {
    inputWhere = document.getElementById('add-place');
    inputCount = document.getElementById('add-howMuch');
    inputWhere.addEventListener('change', (e) => valueInputWhere = e.target.value);
    inputCount.addEventListener('change', (e) => valueInputCount = e.target.value);
    const response = await fetch(`${baseUrl}allExpenses`, {
        method: 'GET'
    });
    let result = await response.json();
    allExpenses = result.data;
    render();
};

const render = () => {

    const contentSum = document.getElementById('sum');
    contentSum.innerHTML = '';
    const containerSum = document.createElement('div');
        
    const sum = document.createElement('p');
    let summa = 0;
    allExpenses.forEach(item => {
        summa += +item.sum;
    });
    sum.innerText = `Итого: ${summa} р.`;
    containerSum.appendChild(sum);
    contentSum.appendChild(containerSum);

    const content = document.getElementById('content-page');
    content.innerHTML = '';
    allExpenses.map((item, index) => {
        const container = document.createElement('div');
        container.id = `expense-${index}`;
        container.className = 'expense-container';

        if (editInd === index) {
            const editInputWhere = document.createElement('input');
            editInputWhere.type = 'text';
            editInputWhere.value = item.store;

            const editInputCount = document.createElement('input');
            editInputCount.type = 'text';
            editInputCount.value = item.sum;
            container.appendChild(editInputWhere);
            container.appendChild(editInputCount);
            const imageDone = document.createElement('img');
            imageDone.src = 'src/done.png';
            imageDone.onclick = () => {
                onDoneItem(editInputWhere.value, editInputCount.value, index);
            };
            container.appendChild(imageDone);
        } else {
            const text = document.createElement('p');
            let date = new Date(item.date);
            date = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
            text.innerText = `${index+1}) ${item.store} ${date}`;
            text.className = 'store';
            container.appendChild(text);

            const count = document.createElement('p');
            count.innerText = `${item.sum} р.`;
            count.className = 'containerForCount';
            container.appendChild(count);

            const containerForImg = document.createElement('div');
            containerForImg.className = 'containerForImg';

            const  imageEdit = document.createElement('img');
            imageEdit.src = 'src/edit1.png';
            imageEdit.onclick = () => {
                onEditItem(index);
            };
            containerForImg.appendChild(imageEdit);

            const imageDelete = document.createElement('img');
            imageDelete.src = 'src/delete.png';
            imageDelete.onclick = () => {
                onDeleteItem(index);
            };
            containerForImg.appendChild(imageDelete);
            container.appendChild(containerForImg);
        }
        content.appendChild(container);
    });
};

const onEditItem = (index) => {
    editInd = index;
    render();
};

const onDeleteItem = async (index) => {
    const response = await fetch(
        `${baseUrl}removeExpense?id=${allExpenses[index]._id}`, 
        {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Access-Control-Allow-Origin': '*'
            }
        }
    );
    let result = await response.json();
    allExpenses = result.data;
    render();
};

const onDoneItem = async (text1, text2, index) => {
   // if (valueInputWhere && valueInputCount) {
        editInd = null;
        const response = await fetch(`${baseUrl}changeExpense`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                _id: allExpenses[index]._id,
                store: text1,
                sum: text2
            }),
        });
        let result = await response.json();
        allExpenses = result.data;
        render();
    //}
};