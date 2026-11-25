const loginScreen = document.getElementById('login-screen');
const menuScreen = document.getElementById('menu-screen');
const staffCodeinput = document.getElementById('staff-code');
const loginBtn = document.getElementById('login-btn');
const manageNavBtn = document.getElementById('manage-nav-btn');
const welcomeMessage = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logout-btn');

//スタッフデータ
const staffData = {
    "0000": { name: "鈴木太郎", role: "general"},
    "9999": { name: "管理者", role: "admin"}
};

//ログインボタンがクリックされた時の処理
loginBtn.addEventListener('click', () => {
    const code = staffCodeinput.value;      //入力された値を取得
    const staff = staffData[code];           //コードをキーにしてスタッフ情報を検索

    if(staff){
        //スタッフが存在した場合

        //ログイン画面に'hidden'クラスを付けて隠し、メニューから外す
        loginScreen.classList.add('hidden');
        menuScreen.classList.remove('hidden');

        welcomeMessage.textContent = `${staff.name} さんがログイン中`;

        //権限によるボタンの表示制御
        if(staff.role === 'general'){
            manageNavBtn.classList.add('hidden');
        } else if(staff.role === 'admin'){
            manageNavBtn.classList.remove('hidden');
        }
    }else{
        alert('エラー：無効なスタッフコードです');
    }
});

//ログアウトボタン
logoutBtn.addEventListener('click', () =>{
    menuScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    staffCodeinput.value = '';     //入力欄を空白に戻す
});

//以下は商品データとレジ画面の制御

//商品マスターデータ
const products = [
    // 食品5点 (category: food)
    { name: "国産コシヒカリ 5kg", category: "food", purchasePrice: 1500, priceEx: 2000, priceIn: 2160, jan: "4900000000001", storeCode: "0000013", stock: 50, threshold: 10 },
    { name: "天然水 2L", category: "food", purchasePrice: 50, priceEx: 80, priceIn: 86, jan: "4900000000002", storeCode: "0000027", stock: 120, threshold: 24 },
    { name: "明治 ミルクチョコレート", category: "food", purchasePrice: 80, priceEx: 110, priceIn: 118, jan: "4900000000003", storeCode: "0000052", stock: 100, threshold: 30 },
    { name: "カップラーメン 醤油", category: "food", purchasePrice: 90, priceEx: 120, priceIn: 129, jan: "4900000000004", storeCode: "0000035", stock: 80, threshold: 20 },
    { name: "ポテトチップス 塩", category: "food", purchasePrice: 70, priceEx: 100, priceIn: 108, jan: "4900000000005", storeCode: "0000049", stock: 60, threshold: 15 },
    // 非食品5点 (category: nonFood)
    { name: "単3アルカリ乾電池 4本", category: "nonFood", purchasePrice: 150, priceEx: 250, priceIn: 275, jan: "4900000000006", storeCode: "0000061", stock: 200, threshold: 50 },
    { name: "トイレットペーパー 12ロール", category: "nonFood", purchasePrice: 250, priceEx: 350, priceIn: 385, jan: "4900000000007", storeCode: "0000078", stock: 80, threshold: 20 },
    { name: "洗濯用洗剤 詰替", category: "nonFood", purchasePrice: 180, priceEx: 280, priceIn: 308, jan: "4900000000008", storeCode: "0000084", stock: 60, threshold: 15 },
    { name: "タミヤ ミニ四駆 モーター", category: "nonFood", purchasePrice: 300, priceEx: 420, priceIn: 462, jan: "4900000000009", storeCode: "0000096", stock: 30, threshold: 10 },
    { name: "ノート 5冊パック", category: "nonFood", purchasePrice: 200, priceEx: 300, priceIn: 330, jan: "4900000000010", storeCode: "0000103", stock: 100, threshold: 20 }
];

//レジ画面用のHTML要素を取得
const registerNavBtn = document.getElementById('register-nav-btn');
const registerScreen = document.getElementById('register-screen');
const backToMenuBtn = document.getElementById('back-to-menu-btn');

//メニューから「レジ売り上げ」ボタンを押したときの操作
registerNavBtn.addEventListener('click', () =>{
    menuScreen.classList.add('hidden');
    registerScreen.classList.remove('hidden');
});

//レジ画面から「戻る」ボタンを押したときの操作
backToMenuBtn.addEventListener('click', () => {
    registerScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
});


//レジの計算・操作用のHTML要素を取得
const barcodeInput = document.getElementById('barcode-input');
const addItemBtn = document.getElementById('add-item-btn');
const registerList = document.getElementById('register-list');

const latestName = document.getElementById('latest-name');
const latestPrice = document.getElementById('latest-price');
const totalcount = document.getElementById('total-count');
const totalExTax = document.getElementById('total-ex-tax');
const totalInTax = document.getElementById('total-in-tax');

const deleteLastBtn = document.getElementById('delete-last-btn');
const clearAllBtn = document.getElementById('clear-all-btn');

//現在カートに入っている商品リスト
let currentCart = [];

//画面表示を更新する機能
function updateRegisterDisplay(){
    //1.直近の商品情報の更新
    if(currentCart.length > 0){
        const lastItem = currentCart[currentCart.length - 1];
        latestName.textContent = lastItem.name;
        latestPrice.textContent = lastItem.priceEx;     //税抜価格
    } else {
        latestName.textContent = "--";
        latestPrice.textContent = "0";
    }

    //2.リスト表示の更新
    registerList.innerHTML = "";
    const displayItems = [...currentCart].reverse().slice(0, 5);

    displayItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.priceEx}円`;
        registerList.appendChild(li);
    });

    //3.合計金額の計算
    let exTaxSum = 0;
    let inTaxSum = 0;

    currentCart.forEach(item => {
        exTaxSum += item.priceEx;
        inTaxSum += item.priceIn;
    });

    totalcount.textContent = currentCart.length;
    totalExTax.textContent = exTaxSum;
    totalInTax.textContent = inTaxSum;
}

//商品追加処理
function handleAddItem(){
    const code = barcodeInput.value;
    if(code === "")return;

    //products配列からJANまたはストアコードで検索
    const foundProduct = products.find(p => p.jan === code || p.storeCode === code);

    if(foundProduct){
        currentCart.push(foundProduct);
        barcodeInput.value = "";
        updateRegisterDisplay();
    } else {
        alert("該当する商品が見つかりません");
    }
}

//ボタンとキーボード操作のイベント登録
addItemBtn.addEventListener('click', handleAddItem);
barcodeInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') handleAddItem();
});

//直近の1件を削除
deleteLastBtn.addEventListener('click', () => {
    if(currentCart.length > 0){
        currentCart.pop();
        updateRegisterDisplay();
    }
});

//全削除
clearAllBtn.addEventListener('click', () => {
    currentCart = [];
    updateRegisterDisplay();
});


//会計(決済)
const checkoutScreen = document.getElementById('checkout-screen');
const checkoutBtn = document.getElementById('checkout-btn');
const cancelCheckoutBtn = document.getElementById('cancel-checkout-btn');

const checkoutTotalCount = document.getElementById('checkout-total-count');
const checkoutTotalInTax = document.getElementById('checkout-total-in-tax');
const tenderedAmount = document.getElementById('tendered-amount');
const executeCheckoutBtn = document.getElementById('execute-checkout-btn');
const changeArea = document.getElementById('change-area');
const changeAmount = document.getElementById('change-amount');
const finishCheckoutBtn = document.getElementById('finish-checkout-btn');

let currentTotalInTax = 0;      //計算用：現在の税込価格金額を保持する変数

//「会計へ進む」ボタンを押したとき
checkoutBtn.addEventListener('click', () => {
    if(currentCart.length === 0){
        alert("商品が入力されていません");
        return;
    }

    //税込合計を再計算
    currentTotalInTax = 0;
    currentCart.forEach(item => {
        currentTotalInTax += item.priceIn;
    });

    //画面の表示を更新
    checkoutTotalCount.textContent = currentCart.length;
    checkoutTotalInTax.textContent = currentTotalInTax;

    //前回の会計状態をリセット
    tenderedAmount.value = "";
    executeCheckoutBtn.classList.add('hidden');
    changeArea.classList.add('hidden');
    cancelCheckoutBtn.classList.remove('hidden');
    tenderedAmount.disabled = false;        //入力欄のロックを解除

    //画面切り替え
    registerScreen.classList.add('hidden');
    checkoutScreen.classList.remove('hidden');
});

//レジに戻るボタン(会計を取り消す場合)
cancelCheckoutBtn.addEventListener('click', () => {
    checkoutScreen.classList.add('hidden');
    registerScreen.classList.remove('hidden');
});

//お預かり金額が入力されるたびに金額をチェックする機能
tenderedAmount.addEventListener('input', () => {
    //入力された金額をintに変換
    const tendered = parseInt(tenderedAmount.value, 10);

    //入力金額が合計金額以上であれば「会計」ボタンを表示
    if(!isNaN(tendered) && tendered >= currentTotalInTax){
        executeCheckoutBtn.classList.remove('hidden');
    }else{
        executeCheckoutBtn.classList.add('hidden');
    }
});

//「会計」ボタンを押したとき
executeCheckoutBtn.addEventListener('click', () => {
    const tendered = parseInt(tenderedAmount.value, 10);
    const change = tendered - currentTotalInTax;

    changeAmount.textContent = change;

    //UIの切り替え
    executeCheckoutBtn.classList.add('hidden');
    cancelCheckoutBtn.classList.add('hidden');
    changeArea.classList.remove('hidden');
    tenderedAmount.disabled = true;
});

//終了ボタンを押したとき(すべてをリセットして次の客へ)
finishCheckoutBtn.addEventListener('click', () => {
    currentCart = [];           //カート(配列)を空に
    updateRegisterDisplay();    //レジ画面の表示をゼロにする

    checkoutScreen.classList.add('hidden');
    registerScreen.classList.remove('hidden');

});

//商品検索機能

// 検索画面用のHTML要素を取得
const searchNavBtn = document.getElementById('search-nav-btn'); // メニュー画面のボタン
const searchScreen = document.getElementById('search-screen');
const searchBackBtn = document.getElementById('search-back-btn');

const searchInput = document.getElementById('search-input');
const searchExecuteBtn = document.getElementById('search-execute-btn');
const searchResultArea = document.getElementById('search-result-area');

// 検索結果を表示する場所を取得
const searchResName = document.getElementById('search-res-name');
const searchResPriceEx = document.getElementById('search-res-price-ex');
const searchResPriceIn = document.getElementById('search-res-price-in');
const searchResStock = document.getElementById('search-res-stock');
const searchResThreshold = document.getElementById('search-res-threshold');

// メニューから「商品検索」ボタンを押したとき
searchNavBtn.addEventListener('click', () => {
    menuScreen.classList.add('hidden');
    searchScreen.classList.remove('hidden');
    
    // 入力欄と検索結果をリセットして初期状態に戻す
    searchInput.value = "";
    searchResultArea.classList.add('hidden');
});

// 検索画面から「戻る」ボタンを押したとき
searchBackBtn.addEventListener('click', () => {
    searchScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
});

// 検索処理を実行する関数
function handleSearch() {
    const code = searchInput.value;
    if (code === "") return;

    // products配列の中から、JANまたはストアコードが一致する商品を探す
    const foundProduct = products.find(p => p.jan === code || p.storeCode === code);

    if (foundProduct) {
        // 見つかった場合、その商品のデータをHTMLのテキストとして差し込む
        searchResName.textContent = foundProduct.name;
        searchResPriceEx.textContent = foundProduct.priceEx;
        searchResPriceIn.textContent = foundProduct.priceIn;
        searchResStock.textContent = foundProduct.stock;
        searchResThreshold.textContent = foundProduct.threshold;
        
        // 検索結果エリアを表示する
        searchResultArea.classList.remove('hidden');
    } else {
        alert("該当する商品が見つかりません。");
        searchResultArea.classList.add('hidden'); // 結果エリアを隠す
    }
}

// 検索ボタンをクリック、またはエンターキーを押したときのイベント登録
searchExecuteBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
});


//商品・税率管理機能

// 画面切り替え用の要素（manageNavBtn はステップ1で取得済み）
const manageScreen = document.getElementById('manage-screen');
const manageBackBtn = document.getElementById('manage-back-btn');

// 税率管理用の要素と変数
const taxRateFoodInput = document.getElementById('tax-rate-food-input');
const taxRateNonfoodInput = document.getElementById('tax-rate-nonfood-input');
const saveTaxBtn = document.getElementById('save-tax-btn');

let currentTaxRateFood = 0.08;   // 8%
let currentTaxRateNonFood = 0.10; // 10%

// 商品編集用の要素
const manageSearchInput = document.getElementById('manage-search-input');
const manageSearchBtn = document.getElementById('manage-search-btn');
const editFormArea = document.getElementById('edit-form-area');

const editName = document.getElementById('edit-name');
const editCategory = document.getElementById('edit-category');
const editPurchase = document.getElementById('edit-purchase');
const editPriceEx = document.getElementById('edit-price-ex');
const editPriceIn = document.getElementById('edit-price-in');
const editStock = document.getElementById('edit-stock');
const editThreshold = document.getElementById('edit-threshold');
const saveProductBtn = document.getElementById('save-product-btn');

let editingProduct = null; // 現在編集中の商品を保持する変数

// メニューから「商品管理画面」ボタンを押したとき
manageNavBtn.addEventListener('click', () => {
    menuScreen.classList.add('hidden');
    manageScreen.classList.remove('hidden');
    
    // 現在の税率を入力欄にセット (例: 0.08 -> 8)
    taxRateFoodInput.value = currentTaxRateFood * 100;
    taxRateNonfoodInput.value = currentTaxRateNonFood * 100;
    
    manageSearchInput.value = "";
    editFormArea.classList.add('hidden');
});

// 管理画面から「戻る」ボタンを押したとき
manageBackBtn.addEventListener('click', () => {
    manageScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
});

// ⑥ 税率の更新処理
saveTaxBtn.addEventListener('click', () => {
    // 入力された数値（%）を小数に変換 (例: 8 -> 0.08)
    currentTaxRateFood = parseFloat(taxRateFoodInput.value) / 100;
    currentTaxRateNonFood = parseFloat(taxRateNonfoodInput.value) / 100;

    // 商品データベース(products)のすべての「税込価格」を一括で再計算
    products.forEach(p => {
        const rate = p.category === 'food' ? currentTaxRateFood : currentTaxRateNonFood;
        p.priceIn = Math.floor(p.priceEx * (1 + rate)); // 小数点以下切り捨て
    });
    
    alert("税率を更新し、全商品の税込価格を一括で再計算しました。");

    // もし今フォームで商品を編集中なら、その画面上の税込価格も連動して書き換える
    if (editingProduct) recalcEditPriceIn();
});

// ⑤ 商品の検索処理（編集用）
function handleManageSearch() {
    const code = manageSearchInput.value;
    editingProduct = products.find(p => p.jan === code || p.storeCode === code);

    if (editingProduct) {
        // 商品が見つかったら、フォームの各入力欄に現在のデータをセット
        editName.value = editingProduct.name;
        editCategory.value = editingProduct.category;
        editPurchase.value = editingProduct.purchasePrice;
        editPriceEx.value = editingProduct.priceEx;
        editPriceIn.value = editingProduct.priceIn;
        editStock.value = editingProduct.stock;
        editThreshold.value = editingProduct.threshold;
        
        editFormArea.classList.remove('hidden'); // フォームを表示
    } else {
        alert("該当する商品が見つかりません。");
        editFormArea.classList.add('hidden');
    }
}
manageSearchBtn.addEventListener('click', handleManageSearch);
manageSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleManageSearch(); });

// 【重要要件】税抜価格や区分が変更されたら、自動で税込価格を計算する処理
function recalcEditPriceIn() {
    const priceEx = parseInt(editPriceEx.value, 10);
    if (isNaN(priceEx)) return;

    // 現在選択されている区分（食品か非食品か）で税率を判定
    const rate = editCategory.value === 'food' ? currentTaxRateFood : currentTaxRateNonFood;
    editPriceIn.value = Math.floor(priceEx * (1 + rate));
}

// ユーザーが「税抜価格」を入力(input)するか、「区分」を変更(change)した瞬間に再計算を走らせる
editPriceEx.addEventListener('input', recalcEditPriceIn);
editCategory.addEventListener('change', recalcEditPriceIn);

// 編集した商品情報を保存（更新）する処理
saveProductBtn.addEventListener('click', () => {
    if (!editingProduct) return;

    // フォームの入力内容を、配列内の商品データに上書き保存
    editingProduct.name = editName.value;
    editingProduct.category = editCategory.value;
    editingProduct.purchasePrice = parseInt(editPurchase.value, 10);
    editingProduct.priceEx = parseInt(editPriceEx.value, 10);
    editingProduct.priceIn = parseInt(editPriceIn.value, 10);
    editingProduct.stock = parseInt(editStock.value, 10);
    editingProduct.threshold = parseInt(editThreshold.value, 10);

    alert(`「${editingProduct.name}」の情報を更新しました！`);
});