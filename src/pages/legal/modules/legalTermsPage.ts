import type { LegalPageContent } from "../types/LegalPageType";
import { legalContactEmail, legalUpdatedAt } from "./legalMeta";

export const legalTermsPage: LegalPageContent = {
  intro:
    "Khi truy cập hoặc sử dụng ứng dụng, bạn đồng ý tuân thủ các Điều khoản sử dụng dưới đây.",
  kind: "terms",
  sections: [
    {
      blocks: [
        {
          items: [
            "Xin quyền truy cập thông tin Zalo cơ bản khi cần thiết.",
            "Lưu thông tin người dùng Zalo cơ bản để tạo hồ sơ trong ứng dụng.",
            "Tạo thông tin cặp đôi, ngày bắt đầu yêu nhau và danh sách ngày kỷ niệm.",
            "Hiển thị số ngày yêu nhau, thông tin hai phía và các mốc kỷ niệm.",
            "Tạo mã mời và mở giao diện chia sẻ của Zalo để mời đối tác tham gia.",
          ],
          type: "list",
        },
        {
          text: "ứng dụng không phải là dịch vụ tư vấn tình cảm, tư vấn pháp lý, y tế hoặc tài chính.",
          type: "notice",
        },
      ],
      title: "1. Phạm vi dịch vụ",
    },
    {
      blocks: [
        {
          text: "ứng dụng hoạt động trong môi trường Zalo Mini App. Một số tính năng yêu cầu bạn cấp quyền truy cập thông tin Zalo cơ bản.",
          type: "paragraph",
        },
        {
          text: "Bạn chịu trách nhiệm về tính chính xác của thông tin bạn nhập, bao gồm ngày bắt đầu, tên hiển thị, ngày kỷ niệm và thông tin liên quan đến cặp đôi.",
          type: "paragraph",
        },
      ],
      title: "2. Tài khoản và quyền truy cập",
    },
    {
      blocks: [
        {
          text: "Bạn giữ quyền đối với nội dung do bạn nhập vào ứng dụng. Bạn cho phép ứng dụng xử lý dữ liệu đó trong phạm vi cần thiết để cung cấp tính năng.",
          type: "paragraph",
        },
        {
          items: [
            "Không nhập nội dung vi phạm pháp luật, quyền riêng tư hoặc quyền của bên thứ ba.",
            "Không nhập nội dung lừa đảo, quấy rối, xúc phạm, đe dọa, bạo lực hoặc không phù hợp.",
            "Không nhập mã độc hoặc nội dung cố ý làm gián đoạn hệ thống.",
          ],
          type: "list",
        },
      ],
      title: "3. Nội dung do người dùng cung cấp",
    },
    {
      blocks: [
        {
          items: [
            "Không truy cập trái phép vào dữ liệu, tài khoản hoặc hệ thống của người khác.",
            "Không khai thác, sao chép, sửa đổi hoặc phân phối ứng dụng trái phép.",
            "Không lạm dụng mã mời, giả mạo danh tính hoặc gây hiểu nhầm cho người dùng khác.",
            "Không sử dụng ứng dụng cho mục đích thương mại trái phép hoặc vi phạm chính sách của Zalo.",
          ],
          type: "list",
        },
      ],
      title: "4. Quy tắc sử dụng",
    },
    {
      blocks: [
        {
          text: `Dữ liệu cá nhân được mô tả tại Chính sách quyền riêng tư. Bạn có thể yêu cầu xóa dữ liệu theo hướng dẫn trong trang Xóa dữ liệu hoặc liên hệ ${legalContactEmail}.`,
          type: "paragraph",
        },
      ],
      title: "5. Quyền riêng tư và liên hệ",
    },
  ],
  subtitle: "Các quy định khi sử dụng ứng dụng",
  title: "Điều khoản sử dụng",
  updatedAt: legalUpdatedAt,
};
