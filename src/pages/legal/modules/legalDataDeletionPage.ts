import type { LegalPageContent } from "../types/LegalPageType";
import { legalContactEmail, legalUpdatedAt } from "./legalMeta";

export const legalDataDeletionPage: LegalPageContent = {
  intro:
    "Bạn có thể rút lại quyền chia sẻ thông tin và yêu cầu xóa dữ liệu sử dụng ứng dụng bất kỳ lúc nào.",
  kind: "data-deletion",
  sections: [
    {
      blocks: [
        {
          items: [
            "Mở Zalo và truy cập ứng dụng.",
            "Mở menu của Mini App.",
            "Vào phần quản lý quyền hoặc quyền chia sẻ thông tin.",
            "Rút lại quyền đã cấp hoặc chọn xóa dữ liệu theo hướng dẫn của Zalo.",
          ],
          type: "steps",
        },
        {
          text: "Sau thao tác này, Zalo có thể gửi sự kiện đến Webhook URL của ứng dụng để chúng tôi xử lý việc rút lại đồng ý và xóa dữ liệu trên hệ thống.",
          type: "paragraph",
        },
      ],
      title: "1. Thực hiện trong Zalo Mini App",
    },
    {
      blocks: [
        {
          text: `Gửi email đến ${legalContactEmail} với tiêu đề "ứng dụng cầu xóa dữ liệu ứng dụng".`,
          type: "paragraph",
        },
        {
          items: [
            "Tên hiển thị Zalo của bạn.",
            "Mô tả yêu cầu: xóa toàn bộ dữ liệu hoặc một phần dữ liệu cụ thể.",
            "Ảnh chụp màn hình hồ sơ ứng dụng nếu có, để hỗ trợ xác minh.",
          ],
          type: "list",
        },
      ],
      title: "2. Gửi yêu cầu qua email",
    },
      {
      blocks: [
        {
          items: [
            "Vào phần thông tin người dùng",
            'Ấn nút "Rời khỏi không gian"',
            "Xác nhận rời không gian",
          ],
          type: "list",
        },
      ],
      title: "3. Xoá dữ liệu trong ứng dụng",
    },
    {
      blocks: [
        {
          items: [
            "Hồ sơ người dùng trong ứng dụng.",
            "Thông tin cặp đôi liên kết với tài khoản của bạn.",
            "Ngày bắt đầu, ngày kỷ niệm, mã mời và dữ liệu liên quan.",
            "Dữ liệu tạm trong localStorage nếu bạn chủ động xóa dữ liệu ứng dụng trên thiết bị hoặc trình duyệt.",
          ],
          type: "list",
        },
      ],
      title: "4. Dữ liệu sẽ được xử lý",
    },
    {
      blocks: [
        {
          text: "Chúng tôi sẽ cố gắng xử lý yêu cầu trong thời gian sớm nhất và thường không quá 30 ngày kể từ khi nhận đủ thông tin cần thiết để xác minh.",
          type: "paragraph",
        },
        {
          text: "Sau khi xóa, một số tính năng có thể không còn hoạt động và dữ liệu đã xóa có thể không khôi phục được.",
          type: "notice",
        },
      ],
      title: "5. Thời gian xử lý và lưu ý",
    },
  ],
  subtitle: "Rút lại quyền đồng ý và xóa dữ liệu ứng dụng",
  title: "Xóa dữ liệu",
  updatedAt: legalUpdatedAt,
};
