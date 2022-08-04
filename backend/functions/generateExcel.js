// Require library
var xl = require("excel4node");
const moment = require("moment");
// const fs = require("fs");
// const util = require("util");
// const fs_writeFile = util.promisify(fs.writeFile);
const status = [
  "მუშავდება",
  "პოტენციური",
  "წაგებული",
  "დაკონტრაქტებული",
  "არ არის დაინტერესებული",
];

async function generateExcel(clinics, res) {
  // Create a new instance of a Workbook class
  var wb = new xl.Workbook();

  // Add Worksheets to the workbook
  var ws = wb.addWorksheet("Sheet 1");

  // Create a reusable style
  var style = wb.createStyle({
    font: {
      size: 12,
    },
    numberFormat: "$#,##0.00; ($#,##0.00); -",
  });

  ws.column(2).setWidth(40);
  ws.column(3).setWidth(40);
  ws.column(4).setWidth(40);
  ws.column(5).setWidth(40);
  ws.column(6).setWidth(40);
  ws.column(7).setWidth(40);
  ws.column(8).setWidth(40);
  ws.column(9).setWidth(40);
  ws.column(10).setWidth(40);
  ws.column(11).setWidth(40);
  ws.column(12).setWidth(60);

  ws.cell(1, 2).string("საიდენტიფიკაციო/კოდი").style(style);
  ws.cell(1, 3).string("ტელეფონის ნომერი").style(style);
  ws.cell(1, 4).string("კლინიკის დასახელება").style(style);
  ws.cell(1, 5).string("საკონტაქტო პირის ტელეფონის ნომერი").style(style);
  ws.cell(1, 6).string("საკონტაქტო პირის ელ.ფოსტა").style(style);
  ws.cell(1, 7).string("საკონტაქტო პირის პოზიცია").style(style);
  ws.cell(1, 8).string("რეგისტრაციის თარიღი").style(style);
  ws.cell(1, 9).string("შემდეგი კონტაქტის თარიღი").style(style);
  ws.cell(1, 10).string("სტატუს").style(style);
  ws.cell(1, 11).string("მენეჯერი").style(style);
  ws.cell(1, 12).string("კომენტარი").style(style);

  clinics?.map((clinic, index) => {
    clinic.status = status[clinic.status - 1];
    ws.row(index + 2).setHeight(30);

    ws.cell(index + 2, 2)
      .string(clinic?.identity_code)
      .style(style);
    ws.cell(index + 2, 3)
      .string(clinic?.phone_number)
      .style(style);
    ws.cell(index + 2, 4)
      .string(clinic?.name)
      .style(style);
    ws.cell(index + 2, 5)
      .string(clinic?.contact_person?.phone_number)
      .style(style);
    ws.cell(index + 2, 6)
      .string(clinic?.contact_person?.email)
      .style(style);
    ws.cell(index + 2, 7)
      .string(clinic?.contact_person?.position)
      .style(style);
    ws.cell(index + 2, 8)
      .string(moment(clinic?.register_date).format("DD/MM/YYYY"))
      .style(style);
    ws.cell(index + 2, 9)
      .string(moment(clinic?.contract_date).format("DD/MM/YYYY"))
      .style(style);
    ws.cell(index + 2, 10)
      .string(clinic?.status)
      .style(style);
    ws.cell(index + 2, 11)
      .string(clinic?.manager_name)
      .style(style);
    ws.cell(index + 2, 12)
      .string(clinic?.comment)
      .style(style);
  });

  // const buffer = await wb.writeToBuffer();

  // fs.unlink("./resources/report.xlsx", async () => {
  //   fs_writeFile("./resources/report.xlsx", buffer, function (err) {
  //     if (err) {
  //       throw err;
  //     }
  //   }).then(() => {
  //     res.status(200).json({
  //       status: `success`,
  //       data: JSON.stringify(wb),
  //     });
  //   });
  // });

  wb.write("Report.xlsx", res)

  // let result = await wb.writeP("./resources/report.xlsx");
}

module.exports = { generateExcel };
