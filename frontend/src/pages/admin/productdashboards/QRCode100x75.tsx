// import React from "react";
// import {
//   Document,
//   Page,
//   View,
//   Text,
//   Image,
//   StyleSheet,
// } from "@react-pdf/renderer";

// // IMPORTANT: register fonts once (path must be public)
// // import "./fonts"; // <-- this file registers Noto fonts
// // import '../../../../public/fonts'
// import '../../../pdf/fonts';
// // 100mm × 75mm → points
// // 1 mm ≈ 2.8346 pt
// const PAGE_WIDTH = 283;  // 100 mm
// const PAGE_HEIGHT = 213; // 75 mm

// const styles = StyleSheet.create({
//   page: {
//     width: PAGE_WIDTH,
//     height: PAGE_HEIGHT,
//     padding: 8,
//     fontFamily: "Noto",
//     flexDirection: "column",
//     justifyContent: "space-between",
//   },

//   header: {
//     fontSize: 9,
//     textAlign: "center",
//     marginBottom: 4,
//   },

//   qrContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   qrImage: {
//     width: 140,
//     height: 140,
//   },

//   footer: {
//     fontSize: 8,
//     textAlign: "center",
//     marginTop: 4,
//   },

//   points: {
//     fontSize: 9,
//     textAlign: "center",
//     marginTop: 2,
//   },
// });

// interface QRCodeImage {
//   qr_code_image: string;
//   points: number;
//   product_qr_id: string;
// }

// interface Props {
//   qrList: QRCodeImage[];
//   company: string;
//   description: string;
// }

// const QRCode100x75: React.FC<Props> = ({
//   qrList,
//   company,
//   description,
// }) => {
//   return (
//     <Document>
//       {qrList.map((qr, index) => (
//         <Page
//           key={index}
//           size={[PAGE_WIDTH, PAGE_HEIGHT]}
//           style={styles.page}
//         >
//           {/* Header (multi-language safe) */}
//           <Text style={styles.header}>{company}</Text>

//           {/* QR Code */}
//           <View style={styles.qrContainer}>
//             <Image
//               style={styles.qrImage}
//               src={qr.qr_code_image} // base64 PNG
//             />
//           </View>

//           {/* Footer text (Hindi / English / mixed) */}
//           <Text style={styles.footer}>{description}</Text>

//           {/* Points */}
//           <Text style={styles.points}>
//             Points: {qr.points}
//           </Text>
//         </Page>
//       ))}
//     </Document>
//   );
// };

// export default QRCode100x75;
