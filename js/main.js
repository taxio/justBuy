
var itemNameList = ["a","b","c","d","e","f","g"];
var itemPriceList = [10,100,30,160,1000,420,700];
var itemPriorityList = [1,1,2,2,3,3,1];
var itemMaxList = [99,"-","-",99,99,99,3];
var itemMinList = [0,0,0,0,0,0,0];
var priorityName = ["A","B","C"];
var itemList = new Array();
var resultList = new Array();
var maxPrice=0;

function registerItem(){
  itemName  = document.getElementById("inputName").value;
  itemPrice = document.getElementById("inputPrice").value;
  itemMax   = document.getElementById("inputMax").value;
  itemMin   = document.getElementById("inputMin").value;

  var priority = parseInt(document.getElementById("priority").value);

  //inputエラー処理
  if(!itemName || !itemPrice){
    alert("指定されてません");
    return;
  }
  itemPrice = parseInt(itemPrice);
  itemMax = parseInt(itemMax);
  itemMin = parseInt(itemMin);
  if(isReallyNaN(itemPrice)){
    alert("価格が正しくありません");
    return;
  }
  if(itemPrice<=0){
    alert("0円以上の商品を登録してください");
    return;
  }
  if(itemMax < 0){
    alert("最大個数が正しくありません");
    return;
  }
  if(isReallyNaN(itemMax)){
    itemMax = "-";
  }
  if(itemMin < 0 || isReallyNaN(itemMin)){
    alert("最小個数が正しくありません");
    return;
  }

  itemNameList.push(itemName);
  itemPriceList.push(itemPrice);
  itemMaxList.push(itemMax);
  itemMinList.push(itemMin);
  itemPriorityList.push(priority);
  generateItemTable();
}

function deleteItem(n){
  itemNameList.splice(n,1);
  itemPriceList.splice(n,1);
  itemPriorityList.splice(n,1);
  itemMaxList.splice(n,1);
  itemMinList.splice(n,1);
  generateItemTable();
}

function generateItemTable(){
  var table = document.getElementById("itemTable");

  var text = "";
  var numItem = itemNameList.length;    //itemPriceListも同じ数

  text += "<tr>";
  text += "<td>" + "商品名" + "</td>";
  text += "<td>" + "単価(円)" + "</td>";
  text += "<td>" + "優先度" + "</td>";
  text += "<td>" + "最大個数" + "</td>";
  text += "<td>" + "最小個数" + "</td>";
  text += "<td>" + "</td>";
  text += "</tr>";

  for(var i=0;i<numItem;i++){
    text += "<tr>";
    text += "<td>" + itemNameList[i] + "</td>";
    text += "<td>" + itemPriceList[i].toString(10) + "</td>";
    text += "<td>" + priorityName[itemPriorityList[i]-1] + "</td>";
    text += "<td>" + itemMaxList[i].toString(10) + "</td>";
    text += "<td>" + itemMinList[i].toString(10) + "</td>";
    text += "<td>" + "<button onclick = \"deleteItem(" + i.toString(10) + ")\">削除</button>" + "</td>";
    text += "</tr>";
  }

  table.innerHTML = text;
}

/*
1.ソート
2.欲張り法でナップサック問題を解く
3.結果をtable形式で表示
*/
function calculation(){

  //予算入力
  maxPrice = parseInt(document.getElementById("budget").value);
  if(isReallyNaN(maxPrice)){
    alert("予算が正しくありません");
    return;
  }

  //itemリストまとめ
  var itemListA = new Array();
  var itemListB = new Array();
  var itemListC = new Array();

  var indexA=0,indexB=0,indexC=0;
  for(var i=0;i<itemNameList.length;i++){
    switch (itemPriorityList[i]) {
      case 1:
      itemListA[indexA] = new Array();
      itemListA[indexA] = [itemNameList[i],itemPriceList[i],itemMaxList[i],itemMinList[i]];
      indexA++;
      break;
      case 2:
      itemListB[indexB] = new Array();
      itemListB[indexB] = [itemNameList[i],itemPriceList[i],itemMaxList[i],itemMinList[i]];
      indexB++;
      break;
      case 3:
      itemListC[indexC] = new Array();
      itemListC[indexC] = [itemNameList[i],itemPriceList[i],itemMaxList[i],itemMinList[i]];
      indexC++;
      break;
      default:
    }
  }

  //ソート
  quickSort(itemListA,0,itemListA.length-1);
  quickSort(itemListB,0,itemListB.length-1);
  quickSort(itemListC,0,itemListC.length-1);

  itemList = new Array();
  Array.prototype.push.apply(itemList, itemListA);
  Array.prototype.push.apply(itemList, itemListB);
  Array.prototype.push.apply(itemList, itemListC);

  resultList = new Array(itemList.length);
  for(var i=0;i<itemList.length;i++){
    resultList[i]=0;
  }

  //最小個数が1個以上の場合は優先度を無視して、まず最小個数だけを購入リストに追加
  for(var i=0;i<itemList.length;i++){
    if(itemList[i][3] > 0){
      maxPrice = maxPrice - itemList[i][3] * itemList[i][1];
      resultList[i] = itemList[i][3];
    }
  }
  if(maxPrice<0){
    maxPrice = maxPrice * (-1);
    alert("指定の最小個数では" + maxPrice.toString(10) + "円不足します");
    return;
  }

  //欲張り法
  for(var i=0;i<itemList.length;i++){
    while(maxPrice >= itemList[i][1]){
      if(resultList[i] >= itemList[i][2]){
        break;
      }
      maxPrice = maxPrice - itemList[i][1];
      resultList[i]++;
    }
  }

  var table = document.getElementById("resultTable");

  var text = "";
  var numItem = itemNameList.length;    //itemPriceListも同じ数

  text += "<tr>";
  text += "<td>" + "商品名" + "</td>";
  text += "<td>" + "個数" + "</td>";
  text += "<td>" + "金額(円)" + "</td>";
  text += "</tr>";

  for(var i=0;i<numItem;i++){
    if(resultList[i] == 0){
      continue;
    }
    text += "<tr>";
    text += "<td>" + itemList[i][0] + "</td>";
    text += "<td>" + resultList[i] + "</td>";
    text += "<td>" + (itemList[i][1] * resultList[i]).toString(10) + "</td>";
    text += "</tr>";
  }

  text += "<tr>";
  text += "<td>" + "残高" + "</td>";
  text += "<td>" + "-" + "</td>";
  text += "<td>" + maxPrice.toString(10) + "</td>";
  text += "</tr>";

  table.innerHTML = text;

  console.log(resultList);

}

function saveResult(){
  var fileName = 'just_buy_result.csv';
  var csvString = "商品名\t単価\t個数\t金額\n";

  if(itemList.length <= 0){
    alert("計算結果がありません");
    return;
  }

  for(var i=0;i<itemList.length;i++){
    if(resultList[i] == 0){
      continue;
    }
    csvString += itemList[i][0]  + "\t";
    csvString += itemList[i][1]  + "\t";
    csvString += resultList[i]   + "\t";
    csvString += (itemList[i][1] * resultList[i]).toString(10) + "\n";
  }
  csvString += "残金" + "\t" + "-" + "\t" + "-" + "\t" + maxPrice.toString(10) + "\n";

  var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  var blob = new Blob([bom, csvString], { type: 'text/csv' });
  var url = (window.URL || window.webkitURL).createObjectURL(blob);
  var a = document.getElementById('download');
  a.download = fileName;
  a.href = url;

}

generateItemTable();
