let title = document.getElementById("title");
let price = document.getElementById("price");
let texes = document.getElementById("texes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let create = document.getElementById("create");
let search = document.getElementById("search");
let mood = "create";
let tmp; // لتخزين رقم العنصر المؤقت عند التعديل

// دالة حساب التوتال
function getTotal() {
    if (price.value !== "") {
        let result = (+price.value + +texes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = "#040";
    } else {
        total.innerHTML = "";
        total.style.background = "#a00d02";
    }
}

// البيانات هتتخزن في localStorage
let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

// عند الضغط على زر create
create.onclick = function () {
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        texes: texes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase()
    };

    // التحقق من صحة الإدخال
    if (title.value !== "" && price.value !== "" && category.value !== "" && newPro.count < 100) {
        if (mood === "create") {
            if (newPro.count > 1) {
                for (let i = 0; i < newPro.count; i++) {
                    dataPro.push(newPro);
                }
            } else {
                dataPro.push(newPro);
            }
        } else {
            dataPro[tmp] = newPro;
            mood = "create";
            create.innerHTML = "Create";
            count.style.display = "block";
        }

        clearData();
    }

    // حفظ في localStorage
    localStorage.setItem("product", JSON.stringify(dataPro));

    showData();
};

// مسح البيانات من الحقول
function clearData() {
    title.value = "";
    price.value = "";
    texes.value = "";
    ads.value = "";
    discount.value = "";
    total.innerHTML = "";
    count.value = "";
    category.value = "";
}

// عرض البيانات
function showData() {
    let table = "";
    for (let i = 0; i < dataPro.length; i++) {
        table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataPro[i].title}</td>
                <td>${dataPro[i].price}</td>
                <td>${dataPro[i].texes}</td>
                <td>${dataPro[i].ads}</td>
                <td>${dataPro[i].discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].category}</td>
                <td><button onclick="updateData(${i})" id="update">update</button></td>
                <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
            </tr>
        `;
    }

    document.getElementById("tbody").innerHTML = table;

    let btnDelete = document.getElementById("Delete_All");
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `Delete All (${dataPro.length})`;
        btnDelete.style.display = "block";
    } else {
        btnDelete.style.display = "none";
    }
}
showData();

// حذف عنصر
function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.setItem("product", JSON.stringify(dataPro));
    showData();
}

// حذف الكل
document.getElementById("Delete_All").onclick = function () {
    localStorage.clear();
    dataPro = [];
    showData();
};

// تحديث عنصر
function updateData(i) {
    let pro = dataPro[i];
    title.value = pro.title;
    price.value = pro.price;
    texes.value = pro.texes;
    ads.value = pro.ads;
    discount.value = pro.discount;
    getTotal();
    count.style.display = "none";
    category.value = pro.category;
    create.innerHTML = "Update";
    mood = "update";
    tmp = i;
    scroll({
        top: 0,
        behavior: "smooth"
    });
}

// البحث
let searchMood = "title";

function getSearchMood(id) {
    if (id === "SearchTitle") {
        searchMood = "title";
    } else {
        searchMood = "category";
    }

    search.placeholder = "Search by " + searchMood;
    search.focus();
    search.value = "";
    showData();
}

function searchData(value) {
    let table = "";
    for (let i = 0; i < dataPro.length; i++) {
        if (
            (searchMood === "title" && dataPro[i].title.includes(value.toLowerCase())) ||
            (searchMood === "category" && dataPro[i].category.includes(value.toLowerCase()))
        ) {
            table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].texes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button onclick="updateData(${i})" id="update">update</button></td>
                    <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
                </tr>
            `;
        }
    }

    document.getElementById("tbody").innerHTML = table;
}
